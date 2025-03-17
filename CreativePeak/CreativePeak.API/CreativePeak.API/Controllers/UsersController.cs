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
    [Authorize]
    public class UsersController : Controller
    {
        private readonly IUserService _userBuyerService;
        private readonly IMapper _mapper;
        public UsersController(IUserService userService, IMapper mapper)
        {
            _userBuyerService = userService;
            _mapper = mapper;
        }

        // GET: api/<BookBuyController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _userBuyerService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<UserDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<BookBuyController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var book = _userBuyerService.GetById(id);
            var bookDTO = _mapper.Map<UserDTO>(book);
            return Ok(bookDTO);
        }

        // POST api/<BookBuyController>
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
            var userNew = await _userBuyerService.AddAsync(newUser);
            return Ok(userNew);
        }

        // PUT api/<BookBuyController>/5
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
            return Ok(_userBuyerService.Update(id, newUser));
        }

        // DELETE api/<BookBuyController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var book = _userBuyerService.GetById(id);
            if (book is null)
            {
                return NotFound();
            }
            _userBuyerService.Delete(book);
            return NoContent();
        }
    }
}
