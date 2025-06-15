using AutoMapper;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Core.PostModels;
using CreativePeak.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            foreach (var dto in list)
            {
                var newDTO = _mapper.Map<DesignerDetails>(dto);
                _designerDetailsRepository.UpdateYearsExperience(newDTO);
            }
            var listDTO = _mapper.Map<IEnumerable<NewDesignerDetailsDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<DesignerDetailsController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var designerDetails = await _designerDetailsService.GetByIdAsync(id);
            var newDesignerDetails = _designerDetailsRepository.UpdateYearsExperience(designerDetails);
            var designerDetailsDTO = _mapper.Map<DesignerDetailsDTO>(newDesignerDetails);

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
                Description = designerDetails.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = designerDetails.UserId
            };

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
        public async Task<ActionResult> Put(int id, [FromBody] DesignerDetailsPostModel designerDetails)
        {
            var existingDesignerDetails = await _designerDetailsService.GetByIdAsync(id);
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
            existingDesignerDetails.Description = designerDetails.Description;
            existingDesignerDetails.UpdatedAt = DateTime.UtcNow;

            var newDesignerDetails = _designerDetailsRepository.UpdateYearsExperience(existingDesignerDetails);
            
            await _designerDetailsService.UpdateAsync(id, newDesignerDetails);

            return NoContent();
        }

        // DELETE api/<DesignerDetailsController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var designerDetails = await _designerDetailsService.GetByIdAsync(id);
            if (designerDetails is null)
            {
                return NotFound();
            }
            _designerDetailsService.Delete(designerDetails);
            return NoContent();
        }
    }
}
