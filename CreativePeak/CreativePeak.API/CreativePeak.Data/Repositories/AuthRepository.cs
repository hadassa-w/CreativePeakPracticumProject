using CreativePeak.Core.IRepositories;
using CreativePeak.Core.Models;
using CreativePeak.Service;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Data.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        private PasswordService PasswordService=new PasswordService();

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
            user.Password = PasswordService.HashPassword(user.Password);
            user.IsActive = true;
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;
            user.Role = "Graphic designer";

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

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }


        // public async Task<User> CreateUserAsync(User user)
        // {
        //     await _context.Users.AddAsync(user);
        //     await _context.SaveChangesAsync();
        //     return user; // החזר את המשתמש שנוצר
        // }
    }
}
