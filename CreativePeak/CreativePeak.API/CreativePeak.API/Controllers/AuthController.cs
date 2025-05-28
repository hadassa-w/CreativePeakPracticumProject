using AutoMapper;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Core.PostModels;
using CreativePeak.Data;
using CreativePeak.Service;
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
        private PasswordService _passwordService;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AuthController(IConfiguration configuration, IAuthRepository authRepository, IUserService userService, ITokenService tokenService,PasswordService passwordService, IMapper mapper, DataContext dataContext)
        {
            _configuration = configuration;
            _authRepository = authRepository;
            _userService = userService;
            _tokenService = tokenService;
            _mapper = mapper;
            _context = dataContext;
            _passwordService = passwordService;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginModel.UserName);

            if (user == null)
            {
                return Unauthorized("The user not found.");
            }

            bool isPasswordValid = _passwordService.VerifyPassword(user.Password, loginModel.Password);

            if (!isPasswordValid)
            {
                return Unauthorized("The username or password is incorrect.");
            }

            if (!user.IsActive)
            {
                return Unauthorized("The username is invalid.");
            }

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var userNew = _mapper.Map<UserDTO>(user);

            var accessToken = _tokenService.CreateAccessToken(user);
            //var refreshToken = _tokenService.CreateRefreshToken();
            //user.RefreshToken = refreshToken;
            //user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userService.UpdateAsync(user.Id, user);

            return Ok(new
            {
                AccessToken = accessToken,
                //RefreshToken = refreshToken,
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

            bool isPasswordValid = _passwordService.VerifyPassword(user.Password, loginModel.Password);

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
            //var refreshToken = _tokenService.CreateRefreshToken();
            //user.RefreshToken = refreshToken;
            //user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userService.UpdateAsync(user.Id, user);

            return Ok(new
            {
                AccessToken = accessToken,
                //RefreshToken = refreshToken,
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
                    expires: DateTime.UtcNow.AddMonths(1),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                await _userService.SendWelcomeEmailAsync(user.Email, user.FullName);
                return Ok(new { Token = tokenString, User = userNew });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new { message = "Email is required" });
            }

            var result = await _userService.ForgotPasswordAsync(request.Email);
            if (result)
            {
                return Ok(new { message = "If the email exists in the system, a reset link has been sent to you." });
            }

            return BadRequest(new { message = "An error occurred while sending the email." });
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] AuthenticateRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }


            var user = await _userService.AuthenticateAsync(request.Email, request.Password);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid email or password" });
            }

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var userNew = _mapper.Map<UserDTO>(user);

            var accessToken = _tokenService.CreateAccessToken(user);
            //var refreshToken = _tokenService.CreateRefreshToken();
            //user.RefreshToken = refreshToken;
            //user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
            await _userService.UpdateAsync(user.Id, user);

            return Ok(new
            {
                AccessToken = accessToken,
                //RefreshToken = refreshToken,
                User = userNew
            });
        }

        // 2. אנדפוינט לשינוי סיסמה (מבטל את הסיסמה הזמנית)
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Email and new password are required" });
            }

            // בדיקת תקינות הסיסמה החדשה (לפי הדרישות שלך)
            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Password must be at least 6 characters long" });
            }

            var result = await _userService.ChangePasswordAsync(request.Email, request.NewPassword);
            if (result)
            {
                return Ok(new { message = "Password was changed successfully. Temporary password is no longer valid." });
            }

            return BadRequest(new { message = "User not found or password change failed." });
        }
    }
}
