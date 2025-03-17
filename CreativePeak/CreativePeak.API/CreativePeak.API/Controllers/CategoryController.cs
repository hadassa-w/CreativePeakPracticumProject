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
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly IMapper _mapper;
        public CategoryController(ICategoryService categoryService, IMapper mapper)
        {
            _categoryService = categoryService;
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
        public ActionResult Get(int id)
        {
            var category = _categoryService.GetById(id);
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
            };
            var CategoryNew = await _categoryService.AddAsync(newCategory);
            return Ok(CategoryNew);
        }

        // PUT api/<CategoryController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] CategoryPostModel category)
        {
            var newCategory = new Category
            {
                CategoryName = category.CategoryName,
                Description = category.Description,
            };
            return Ok(_categoryService.Update(id, newCategory));
        }

        // DELETE api/<CategoryController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var category = _categoryService.GetById(id);
            if (category is null)
            {
                return NotFound();
            }
            _categoryService.Delete(category);
            return NoContent();
        }
    }
}
