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
    public class ViewController : Controller
    {
        private readonly IViewService _viewService;
        private readonly IUserService _userService;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;
        public ViewController(IViewService viewService, IMapper mapper, IUserService userService, IImageService imageService)
        {
            _viewService = viewService;
            _userService = userService;
            _imageService = imageService;
            _mapper = mapper;
        }

        // GET: api/<ViewController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _viewService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<ViewDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<ViewController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var view = _viewService.GetById(id);
            var viewDTO = _mapper.Map<ViewDTO>(view);
            return Ok(viewDTO);
        }

        // POST api/<ViewController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ViewPostModel view)
        {
            var newView = new View
            {
                User = _userService.GetById(view.UserId),
                UserId = view.UserId,
                Image = _imageService.GetById(view.ImageId),
                ImageId = view.ImageId,
                Date = DateTime.UtcNow,
            };
            var viewNew = await _viewService.AddAsync(newView);
            var viewDTO = _mapper.Map<ViewDTO>(viewNew);
            return CreatedAtAction(nameof(Get), new { id = viewDTO.Id }, viewDTO);
        }

        // DELETE api/<ViewController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var view = _viewService.GetById(id);
            if (view is null)
            {
                return NotFound();
            }
            _viewService.Delete(view);
            return NoContent();
        }
    }
}
