using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class S3ImagesController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;

        public S3ImagesController(IAmazonS3 s3Client)
        {
            _s3Client = s3Client;
        }

        [HttpGet("image-url")]
        public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
        {
            string contentType = "image/jpeg"; // ברירת מחדל

            if (fileName.EndsWith(".png"))
            {
                contentType = "image/png";
            }
            else if (fileName.EndsWith(".pdf"))
            {
                contentType = "application/pdf";
            }

            var request = new GetPreSignedUrlRequest
            {
                BucketName = Environment.GetEnvironmentVariable("AWS:BucketName"),
                Key = fileName,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(5),
                ContentType = contentType
            };

            string url = _s3Client.GetPreSignedURL(request);
            return Ok(new { url });
        }
    }
}
