using AutoMapper;
using CreativePeak.API.PostModels;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class ImageController : Controller
    {
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;
        public ImageController(IImageService imageService, IMapper mapper)
        {
            _imageService = imageService;
            _mapper = mapper;
        }

        // GET: api/<ImageController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _imageService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<ImageDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<ImageController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var image = _imageService.GetById(id);
            var imageDTO = _mapper.Map<ImageDTO>(image);
            return Ok(imageDTO);
        }

        // POST api/<ImageController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ImagePostModel image)
        {
            var newImage = new Image
            {
                FileName = image.FileName,
                Description = image.Description,
                DesignerId = image.DesignerId,
                CategoryId = image.CategoryId,
            };
            var imageNew = await _imageService.AddAsync(newImage);
            return Ok(imageNew);
        }

        // PUT api/<ImageController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] ImagePostModel image)
        {
            var newImage = new Image
            {
                FileName = image.FileName,
                Description = image.Description,
                DesignerId = image.DesignerId,
                CategoryId = image.CategoryId,
            };
            return Ok(_imageService.Update(id, newImage));
        }

        // DELETE api/<ImageController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var image = _imageService.GetById(id);
            if (image is null)
            {
                return NotFound();
            }
            _imageService.Delete(image);
            return NoContent();
        }
    }
}
