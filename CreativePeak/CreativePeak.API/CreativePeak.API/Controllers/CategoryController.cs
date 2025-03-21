﻿using AutoMapper;
using CreativePeak.API.PostModels;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
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
        private readonly IDesignerDetailsService _designerDetailsService;
        private readonly IMapper _mapper;
        public CategoryController(ICategoryService categoryService, IDesignerDetailsService designerDetailsService, IMapper mapper)
        {
            _categoryService = categoryService;
            _designerDetailsService = designerDetailsService;
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
                DesignerDetails = _designerDetailsService.GetById(category.DesignerDetailsId),
                CreatedAt = DateTime.UtcNow,
            };
            var categoryNew = await _categoryService.AddAsync(newCategory);
            var categoryDTO = _mapper.Map<CategoryDTO>(categoryNew);
            return CreatedAtAction(nameof(Get), new { id = categoryDTO.Id }, categoryDTO);
        }

        // PUT api/<CategoryController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] CategoryPostModel category)
        {
            var existingCategory = _categoryService.GetById(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.Description = category.Description;
            existingCategory.DesignerDetails = _designerDetailsService.GetById(category.DesignerDetailsId);
            existingCategory.UpdatedAt = DateTime.UtcNow;

            _categoryService.Update(id, existingCategory);
            return NoContent();
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
