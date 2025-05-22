using CreativePeak.Core.DTOs;
using CreativePeak.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CreativePeak.API.Controllers
{
    public class ReportsController : Controller
    {
        DataContext _context;

        public ReportsController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("monthly-summary")]
        public async Task<IActionResult> GetMonthlySummary()
        {
            var fromDate = DateTime.UtcNow.AddMonths(-12);

            var users = await _context.Users
                .Where(u => u.CreatedAt >= fromDate)
                .GroupBy(u => new { u.CreatedAt.Year, u.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
            .ToListAsync();

            var portfolios = await _context.Images
                .Where(p => p.CreatedAt >= fromDate)
                .GroupBy(p => new { p.CreatedAt.Year, p.CreatedAt.Month })
                .Select(g => new
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .ToListAsync();

            var allMonths = users
                .Select(u => new { u.Year, u.Month })
                .Union(portfolios.Select(p => new { p.Year, p.Month }))
                .Distinct()
                .OrderBy(x => x.Year).ThenBy(x => x.Month)
                .ToList();

            var result = allMonths.Select(m => new Reports
            {
                Month = $"{m.Month:D2}/{m.Year}",
                NewUsers = users.FirstOrDefault(u => u.Month == m.Month && u.Year == m.Year)?.Count ?? 0,
                NewPortfolios = portfolios.FirstOrDefault(p => p.Month == m.Month && p.Year == m.Year)?.Count ?? 0
            }).ToList();

            return Ok(result);
        }
    }
}
