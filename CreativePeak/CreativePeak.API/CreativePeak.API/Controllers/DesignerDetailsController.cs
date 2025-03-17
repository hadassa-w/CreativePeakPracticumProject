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
    public class DesignerDetailsController : Controller
    {
        private readonly IDesignerDetailsService _designerDetailsService;
        private readonly IMapper _mapper;
        public DesignerDetailsController(IDesignerDetailsService designerDetailsService, IMapper mapper)
        {
            _designerDetailsService = designerDetailsService;
            _mapper = mapper;
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
            };
            var designerDetailsNew = await _designerDetailsService.AddAsync(newDesignerDetails);
            return Ok(designerDetailsNew);
        }

        // PUT api/<DesignerDetailsController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] DesignerDetailsPostModel designerDetails)
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
            };
            return Ok(_designerDetailsService.Update(id, newDesignerDetails));
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
