using AutoMapper;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Core.PostModels;
using CreativePeak.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public CategoryController(ICategoryService categoryService, IUserService userService, IMapper mapper)
        {
            _categoryService = categoryService;
            _userService = userService;
            _mapper = mapper;
        }

        // GET: api/<CategoryController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _categoryService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<CategoryDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var category =await _categoryService.GetByIdAsync(id);
            //var categoryDTO = _mapper.Map<CategoryDTO>(category);
            var categoryDTO = _mapper.Map<CategoryDTO>(category);
            return Ok(categoryDTO);
        }

        // POST api/<CategoryController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] CategoryPostModel category)
        {
            var newCategory = new Category
            {
                CategoryName = category.CategoryName,
                Description = category.Description,
                UserId = category.UserId,
                User = await _userService.GetByIdAsync(category.UserId),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            var categoryNew = await _categoryService.AddAsync(newCategory);
            var categoryDTO = _mapper.Map<CategoryDTO>(categoryNew);
            return CreatedAtAction(nameof(Get), new { id = categoryDTO.Id }, categoryDTO);
            //var categoryDTO = _mapper.Map<Category>(category);
            //var categoryNew = await _categoryService.AddAsync(categoryDTO);
            //return Ok(categoryDTO);
        }

        // PUT api/<CategoryController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] CategoryPostModel category)
        {
            var existingCategory = await _categoryService.GetByIdAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.Description = category.Description;
            existingCategory.UserId =category.UserId;
            existingCategory.User = await _userService.GetByIdAsync(category.UserId);
            existingCategory.UpdatedAt = DateTime.UtcNow;

            await _categoryService.UpdateAsync(id, existingCategory);
            return NoContent();
        }

        // DELETE api/<CategoryController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category is null)
            {
                return NotFound();
            }
            _categoryService.Delete(category);
            return NoContent();
        }
    }
}
