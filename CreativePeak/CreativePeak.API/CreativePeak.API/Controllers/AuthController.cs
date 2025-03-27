using AutoMapper;
using CreativePeak.API.PostModels;
using CreativePeak.Core;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Data.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        private readonly IMapper _mapper;

        public AuthController(IConfiguration configuration, IAuthRepository authRepository, IMapper mapper)
        {
            _configuration = configuration;
            _authRepository = authRepository;
            _mapper = mapper;
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            // חפש את המשתמש בבסיס הנתונים
            var user = await _authRepository.GetByCondition(u => u.Email == loginModel.UserName && u.Password == loginModel.Password);

            if (user != null)
            {
                var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Role, user.Role) // נניח שיש למודל User תכונה Role
                };

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWT:Key")));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: _configuration.GetValue<string>("JWT:Issuer"),
                    audience: _configuration.GetValue<string>("JWT:Audience"),
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(6),
                    signingCredentials: signinCredentials
                );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return Ok(new { Token = tokenString, User = user });
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
                var user = _mapper.Map<User>(userPostModel);

                // הוסף את המשתמש לבסיס הנתונים
                await _authRepository.CreateUserAsync(user);

                // יצירת טוקן JWT למשתמש החדש
                var claims = new List<Claim>()
                {
                    new Claim(ClaimTypes.Name, user.FullName),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetValue<string>("JWT:Key")));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(
                    issuer: _configuration.GetValue<string>("JWT:Issuer"),
                    audience: _configuration.GetValue<string>("JWT:Audience"),
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(6),
                    signingCredentials: signinCredentials
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return Ok(new { Token = tokenString, User = user });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
