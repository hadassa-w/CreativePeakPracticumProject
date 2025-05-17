using CreativePeak.Core.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;

namespace CreativePeak.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        [HttpPost("AI-description")]
        public async Task<IActionResult> GenerateDescription([FromBody] string projectName)
        {
            if (string.IsNullOrWhiteSpace(projectName))
                return BadRequest("Project name is required.");

            var apiKey = Environment.GetEnvironmentVariable("OpenAIResponse");

            if (string.IsNullOrEmpty(apiKey))
                return StatusCode(500, "API Key not configured");

            using var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            var requestBody = new
            {
                model = "gpt-4o-mini",
                temperature = 0.5,
                max_tokens = 150,
                messages = new[]
                {
                    new { role = "system", content = "You are an assistant that writes short, clear, and creative project descriptions." },
                    new { role = "user", content = $"Suggest a short and clear description for a project called: {projectName}" }
    }
                };

            var response = await client.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestBody);
            var responseString = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, $"OpenAI Error: {responseString}");

            var result = JsonSerializer.Deserialize<OpenAIResponse>(responseString);

            if (result?.choices == null || !result.choices.Any())
                return BadRequest("No response from OpenAI.");

            return Ok(result.choices.First().message.content);
        }
    }
}
