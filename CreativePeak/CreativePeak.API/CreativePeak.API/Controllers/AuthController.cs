using AutoMapper;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Core.PostModels;
using CreativePeak.Data;
using CreativePeak.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthRepository _authRepository;
        private readonly DataContext _context;
        private PasswordService passwordService = new PasswordService();
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AuthController(IConfiguration configuration, IAuthRepository authRepository, IUserService userService, ITokenService tokenService, IMapper mapper, DataContext dataContext)
        {
            _configuration = configuration;
            _authRepository = authRepository;
            _userService = userService;
            _tokenService = tokenService;
            _mapper = mapper;
            _context = dataContext;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginModel.UserName);

            if (user == null)
            {
                return Unauthorized("The user not found.");
            }

            bool isPasswordValid = passwordService.VerifyPassword(user.Password, loginModel.Password);

            if (!isPasswordValid)
            {
                return Unauthorized("The username or password is incorrect.");
            }

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var userNew = _mapper.Map<UserDTO>(user);

            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = _tokenService.CreateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userService.UpdateAsync(user.Id, user);

            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = userNew
            });
        }

        [HttpPost("LoginAdmin")]
        public async Task<IActionResult> LoginAdmin([FromBody] LoginModel loginModel)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginModel.UserName);

            if (user == null)
            {
                return Unauthorized("The user not found.");
            }

            bool isPasswordValid = passwordService.VerifyPassword(user.Password, loginModel.Password);

            if (!isPasswordValid)
            {
                return Unauthorized("The username or password is incorrect.");
            }

            if (user.Role != "Main admin")
            {
                return Unauthorized("This user is not authorized to log in.");
            }

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var userNew = _mapper.Map<UserDTO>(user);

            var accessToken = _tokenService.CreateAccessToken(user);
            var refreshToken = _tokenService.CreateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userService.UpdateAsync(user.Id, user);

            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                User = userNew
            });
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserPostModel userPostModel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // בדיקה אם האימייל כבר קיים
                var existingUser = await _authRepository.GetByCondition(u => u.Email == userPostModel.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email is already in use" });
                }

                var user = _mapper.Map<User>(userPostModel);

                // הוסף את המשתמש לבסיס הנתונים
                await _authRepository.CreateUserAsync(user);

                // יצירת טוקן JWT למשתמש החדש
                var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var userNew = _mapper.Map<UserDTO>(user);

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(
                    issuer: _configuration["JWT:Issuer"],
                    audience: _configuration["JWT:Audience"],
                    claims: claims,
                    //expires: DateTime.UtcNow.AddMinutes(6),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return Ok(new { Token = tokenString, User = userNew });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        [AllowAnonymous]
        [HttpPost("Refresh-token")]
        public async Task<IActionResult> Refresh([FromBody] TokenRequestModel model)
        {
            var principal = _tokenService.GetPrincipalFromExpiredToken(model.AccessToken);
            var email = principal?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            //var email = principal.Identity?.Name;
            //var user = await _userService.GetByEmailAsync(email);
            var user = await _authRepository.GetByCondition(u => u.Email == email);

            if (user is null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiry <= DateTime.UtcNow)
            {
                return Unauthorized("Invalid refresh token.");
            }

            var newAccessToken = _tokenService.CreateAccessToken(user);
            var newRefreshToken = _tokenService.CreateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userService.UpdateAsync(user.Id, user);

            return Ok(new
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            });
        }
    }
}
