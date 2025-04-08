
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CreativePeak.Core.IServices;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.Models;
using CreativePeak.Service;
using CreativePeak.Core.PostModels;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        private PasswordService passwordService = new PasswordService();
        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // GET: api/<UserController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _userService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<UserDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            var userDTO = _mapper.Map<UserDTO>(user);
            return Ok(userDTO);
        }

        // POST api/<UserController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] UserPostModel user)
        {
            var newUser = new User
            {
                FullName = user.FullName,
                Email = user.Email,
                Password = passwordService.HashPassword(user.Password),
                Phone = user.Phone,
                Address = user.Address,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                Role = "Graphic designer"
            };
            var userNew = await _userService.AddAsync(newUser);
            var userDTO = _mapper.Map<UserDTO>(userNew);
            return CreatedAtAction(nameof(Get), new { id = userDTO.Id }, userDTO);

            //var userDTO = _mapper.Map<User>(user);
            //var userNew = await _userService.AddAsync(userDTO);
            //return Ok(userDTO);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateWithPassword(int id, [FromBody] UserPostModel user)
        {
            var existingUser = await _userService.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.FullName = user.FullName;
            existingUser.Email = user.Email;
            existingUser.Phone = user.Phone;
            existingUser.Address = user.Address;
            existingUser.UpdatedAt = DateTime.Now;

            existingUser.Password = passwordService.HashPassword(user.Password); // עדכון סיסמה

            await _userService.UpdateAsync(id, existingUser);
            return NoContent();
        }

        [HttpPut("updateWithoutPassword/{id}")]
        public async Task<ActionResult> UpdateWithoutPassword(int id, [FromBody] UserWithoutPasswordPostModel user)
        {
            var existingUser = await _userService.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.FullName = user.FullName;
            existingUser.Email = user.Email;
            existingUser.Phone = user.Phone;
            existingUser.Address = user.Address;
            existingUser.UpdatedAt = DateTime.Now;

            await _userService.UpdateAsync(id, existingUser);
            return NoContent();
        }


        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user is null)
            {
                return NotFound();
            }
            _userService.Delete(user);
            return NoContent();
        }
    }
}
