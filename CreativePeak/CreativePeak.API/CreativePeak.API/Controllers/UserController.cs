using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CreativePeak.Core.IServices;
using CreativePeak.Core.DTOs;
using CreativePeak.API.PostModels;
using CreativePeak.Core.Models;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
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
        public ActionResult Get(int id)
        {
            var user = _userService.GetById(id);
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
                Password = user.Password,
                Phone = user.Phone,
                Address = user.Address,
            };
            var userNew = await _userService.AddAsync(newUser);
            return Ok(userNew);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] UserPostModel user)
        {
            var newUser = new User
            {
                FullName = user.FullName,
                Email = user.Email,
                Password = user.Password,
                Phone = user.Phone,
                Address = user.Address,
            };
            return Ok(_userService.Update(id, newUser));
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var user = _userService.GetById(id);
            if (user is null)
            {
                return NotFound();
            }
            _userService.Delete(user);
            return NoContent();
        }
    }
}
