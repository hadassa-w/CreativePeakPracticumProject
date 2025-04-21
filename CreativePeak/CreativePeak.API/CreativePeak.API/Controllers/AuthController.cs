using AutoMapper;
using CreativePeak.Core;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Core.PostModels;
using CreativePeak.Data;
using CreativePeak.Data.Repositories;
using CreativePeak.Service;
using Microsoft.AspNetCore.Http;
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
        private PasswordService passwordService=new PasswordService();
        private readonly IMapper _mapper;

        public AuthController(IConfiguration configuration, IAuthRepository authRepository, IMapper mapper,DataContext dataContext)
        {
            _configuration = configuration;
            _authRepository = authRepository;
            _mapper = mapper;
            _context = dataContext;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            // מחפש את המשתמש בבסיס הנתונים
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginModel.UserName);

            if (user == null)
            {
                return Unauthorized("The user not found.");
            }

            // בדיקת הסיסמה
            bool isPasswordValid = passwordService.VerifyPassword(user.Password, loginModel.Password);

            //return Ok(user);

            if (user != null)
            {
                var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Role, user.Role) // נניח שיש למודל User תכונה Role
                };

                var userNew = _mapper.Map<UserDTO>(user);

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));  // גישה ישירה עם key
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(
                    issuer: _configuration["JWT:Issuer"],
                    audience: _configuration["JWT:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(6),  // השתמש ב-UTC כדי לשמור על התאמה בכל אזורי הזמן
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return Ok(new { Token = tokenString, User = userNew });
            }
            return Unauthorized();
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
                    expires: DateTime.UtcNow.AddMinutes(6),
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
    }
}
