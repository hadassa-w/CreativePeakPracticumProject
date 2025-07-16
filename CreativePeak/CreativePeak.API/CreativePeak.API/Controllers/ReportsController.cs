using CreativePeak.Core.DTOs;
using CreativePeak.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CreativePeak.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : Controller
    {
        DataContext _context;

        public ReportsController(DataContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Main admin")]
        [HttpGet("monthly-summary")]
        public async Task<IActionResult> GetMonthlySummary()
        {
            var users = await _context.Users
                .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            var portfolios = await _context.Images
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            var allExistingMonths = users
                .Select(u => new { u.Year, u.Month })
                .Union(portfolios.Select(p => new { p.Year, p.Month }))
                .Distinct()
                .ToList();

            if (!allExistingMonths.Any())
            {
                return Ok(new List<Reports>());
            }

            var minDate = allExistingMonths
                .Select(m => new DateTime(m.Year, m.Month, 1))
                .Min();

            var maxDate = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

            var allMonths = new List<DateTime>();
            var current = minDate;
            while (current <= maxDate)
            {
                allMonths.Add(current);
                current = current.AddMonths(1);
            }

            var result = allMonths.Select(date => new Reports
            {
                Month = $"{date.Month:D2}/{date.Year}",
                NewUsers = users.FirstOrDefault(u => u.Month == date.Month && u.Year == date.Year)?.Count ?? 0,
                NewPortfolios = portfolios.FirstOrDefault(p => p.Month == date.Month && p.Year == date.Year)?.Count ?? 0
            }).ToList();

            return Ok(result);
        }
    }
}
