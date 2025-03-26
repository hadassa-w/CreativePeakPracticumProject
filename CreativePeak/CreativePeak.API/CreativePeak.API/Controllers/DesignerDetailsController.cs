﻿using AutoMapper;
using CreativePeak.API.PostModels;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class DesignerDetailsController : Controller
    {
        private readonly IDesignerDetailsService _designerDetailsService;
        private readonly IDesignerDetailsRepository _designerDetailsRepository;
        private readonly IMapper _mapper;
        public DesignerDetailsController(IDesignerDetailsService designerDetailsService, IMapper mapper, IDesignerDetailsRepository designerDetailsRepository)
        {
            _designerDetailsService = designerDetailsService;
            _mapper = mapper;
            _designerDetailsRepository = designerDetailsRepository;
        }

        // GET: api/<DesignerDetailsController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _designerDetailsService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<DesignerDetailsDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<DesignerDetailsController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var designerDetails = _designerDetailsService.GetById(id);
            var designerDetailsDTO = _mapper.Map<DesignerDetailsDTO>(designerDetails);
            return Ok(designerDetailsDTO);
        }

        // POST api/<DesignerDetailsController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DesignerDetailsPostModel designerDetails)
        {
            var newDesignerDetails = new DesignerDetails
            {
                FullName = designerDetails.FullName,
                AddressSite = designerDetails.AddressSite,
                Email = designerDetails.Email,
                Phone = designerDetails.Phone,
                YearsExperience = designerDetails.YearsExperience,
                PriceRangeMin = designerDetails.PriceRangeMin,
                PriceRangeMax = designerDetails.PriceRangeMax,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = designerDetails.UserId // הוסף את ה-UserId כאן
            };

            // ודא שהמשתמש קיים לפני הוספת הפרטים
            var userExists = await _designerDetailsRepository.UserExists(designerDetails.UserId);
            if (!userExists)
            {
                return BadRequest("User does not exist.");
            }

            var designerDetailsNew = await _designerDetailsService.AddAsync(newDesignerDetails);
            var designerDetailsDTO = _mapper.Map<DesignerDetailsDTO>(designerDetailsNew);
            return CreatedAtAction(nameof(Get), new { id = designerDetailsDTO.Id }, designerDetailsDTO);
        }

        // PUT api/<DesignerDetailsController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] DesignerDetailsPostModel designerDetails)
        {
            var existingDesignerDetails = _designerDetailsService.GetById(id);
            if (existingDesignerDetails == null)
            {
                return NotFound();
            }

            existingDesignerDetails.FullName = designerDetails.FullName;
            existingDesignerDetails.AddressSite = designerDetails.AddressSite;
            existingDesignerDetails.Email = designerDetails.Email;
            existingDesignerDetails.Phone = designerDetails.Phone;
            existingDesignerDetails.YearsExperience = designerDetails.YearsExperience;
            existingDesignerDetails.PriceRangeMin = designerDetails.PriceRangeMin;
            existingDesignerDetails.PriceRangeMax = designerDetails.PriceRangeMax;
            existingDesignerDetails.UpdatedAt = DateTime.UtcNow;

            _designerDetailsService.Update(id, existingDesignerDetails);
            return NoContent();
        }

        // DELETE api/<DesignerDetailsController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var designerDetails = _designerDetailsService.GetById(id);
            if (designerDetails is null)
            {
                return NotFound();
            }
            _designerDetailsService.Delete(designerDetails);
            return NoContent();
        }
    }
}
