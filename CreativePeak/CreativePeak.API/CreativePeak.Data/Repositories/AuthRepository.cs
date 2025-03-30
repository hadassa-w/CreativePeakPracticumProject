using CreativePeak.Core.IRepositories;
using CreativePeak.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Data.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> GetByCondition(Expression<Func<User, bool>> expression)
        {
            return await _context.Users.FirstOrDefaultAsync(expression);
        }
        public async Task<User> CreateUserAsync(User user)
        {
            // אתחול שדות חובה
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.Role = "Graphic designer"; // או כל ערך ברירת מחדל אחר שתרצה

            await _context.Users.AddAsync(user);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // לוג מפורט של השגיאה
                var innerMessage = ex.InnerException?.Message ?? "No inner exception";
                throw new Exception($"Failed to save user: {ex.Message}. Inner exception: {innerMessage}");
            }

            return user;
        }

        // public async Task<User> CreateUserAsync(User user)
        // {
        //     await _context.Users.AddAsync(user);
        //     await _context.SaveChangesAsync();
        //     return user; // החזר את המשתמש שנוצר
        // }
    }
}
