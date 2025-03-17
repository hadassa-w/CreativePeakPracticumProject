using CreativePeak.Core.IRepositories;
using CreativePeak.Data;
using Microsoft.EntityFrameworkCore;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

    }
}
