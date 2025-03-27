using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CreativePeak.Core.IServices;
using CreativePeak.Core.DTOs;
using CreativePeak.API.PostModels;
using CreativePeak.Core.Models;
using CreativePeak.Service;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : Controller
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
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
            var userDTO = _mapper.Map<User>(user);
            var userNew = await _userService.AddAsync(userDTO);
            return Ok(userDTO);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UserPostModel user)
        {
            var existingUser = await _userService.GetByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.FullName = user.FullName;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;
            existingUser.Phone = user.Phone;
            existingUser.Address = user.Address;
            existingUser.UpdatedAt = DateTime.UtcNow;

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
