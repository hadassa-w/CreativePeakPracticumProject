using CreativePeak.Core.IRepositories;
using CreativePeak.Data;
using Microsoft.EntityFrameworkCore;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace CreativePeak.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<User> _dbSet;

        public UserRepository(DataContext dataContext)
        {
            _context = dataContext;
            _dbSet = _context.Set<User>();
        }

        public User Add(User user)
        {
            _dbSet.Add(user);
            _context.SaveChanges();
            return user;
        }

        public void Delete(User user)
        {
            _dbSet.Remove(user);
            _context.SaveChanges();
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public User? GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public User Update(User user)
        {
            _dbSet.Update(user);
            _context.SaveChanges();
            return user;
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return null;

            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        // מתודה חדשה לניקוי סיסמאות זמניות שפג תוקפן
        public async Task CleanExpiredTemporaryPasswordsAsync()
        {
            var expiredUsers = await _context.Users
                .Where(u => u.TempPasswordExpiry.HasValue &&
                           u.TempPasswordExpiry.Value <= DateTime.UtcNow)
                .ToListAsync();

            foreach (var user in expiredUsers)
            {
                user.TempPassword = null;
                user.TempPasswordExpiry = null;
            }

            if (expiredUsers.Any())
            {
                await _context.SaveChangesAsync();
            }
        }
    }
}