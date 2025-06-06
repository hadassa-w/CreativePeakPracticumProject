﻿using Amazon.Extensions.NETCore.Setup;
using Amazon.S3.Model;
using Amazon.S3;
using AutoMapper;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using CreativePeak.Core.PostModels;
using CreativePeak.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ImageController : Controller
    {
        private readonly IAmazonS3 _amazonS3;
        private readonly IImageService _imageService;
        private readonly ICategoryService _categoryService;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public ImageController(IImageService imageService, IAmazonS3 amazonS3, IMapper mapper, ICategoryService categoryService, IUserService userService)
        {
            _imageService = imageService;
            _mapper = mapper;
            _categoryService = categoryService;
            _userService = userService;
            _amazonS3 = amazonS3;
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
        public async Task<ActionResult> GetByIdAsync(int id)
        {
            var image = await _imageService.GetByIdAsync(id);
            if (image == null)
            {
                return NotFound();
            }
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
                FileType = image.FileName.Substring(image.FileName.LastIndexOf('.') + 1),
                LinkURL = image.LinkURL,
                IsDeleted = false,
                UserId = image.UserId,
                User = await _userService.GetByIdAsync(image.UserId),
                CategoryId = image.CategoryId,
                Category = await _categoryService.GetByIdAsync(image.CategoryId),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };
            var imageNew = await _imageService.AddAsync(newImage);
            var imageDTO = _mapper.Map<ImageDTO>(imageNew);
            return CreatedAtAction(nameof(Get), new { id = imageDTO.Id }, imageDTO);
        }

        // PUT api/<ImageController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] ImagePostModel image)
        {
            var existingImage = await _imageService.GetByIdAsync(id);
            if (existingImage == null)
            {
                return NotFound();
            }

            existingImage.FileName = image.FileName;
            existingImage.Description = image.Description;
            existingImage.LinkURL = image.LinkURL;
            existingImage.UserId = image.UserId;
            existingImage.User = await _userService.GetByIdAsync(image.UserId);
            existingImage.CategoryId = image.CategoryId;
            existingImage.Category = await _categoryService.GetByIdAsync(image.CategoryId);
            existingImage.UpdatedAt = DateTime.UtcNow;

            await _imageService.UpdateAsync(id, existingImage);
            return NoContent();
        }

        //// DELETE api/<ImageController>/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult> Delete(int id)
        //{
        //    var image = await _imageService.GetByIdAsync(id);
        //    if (image is null)
        //    {
        //        return NotFound();
        //    }
        //    image.IsDeleted = true;
        //    _imageService.Delete(image);
        //    return NoContent();
        //}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var image = await _imageService.GetByIdAsync(id);
            if (image is null)
            {
                return NotFound();
            }
            try
            {
                var key = GetKeyFromUrl(image.LinkURL);
                var deleteRequest = new DeleteObjectRequest
                {
                    BucketName = "creativepeakproject.aws-testpnoren",
                    Key = key
                };

                await _amazonS3.DeleteObjectAsync(deleteRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "שגיאה במחיקת הקובץ מה-S3: " + ex.Message);
            }

            image.IsDeleted = true;
            _imageService.Delete(image);

            return NoContent();
        }

        private string GetKeyFromUrl(string url)
        {
            var uri = new Uri(url);
            var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);

            // מסיר את שם הבקט מתוך ה-Path
            var keySegments = segments.Skip(1);
            var key = string.Join("/", keySegments);

            return Uri.UnescapeDataString(key);
        }

    }
}
