using CreativePeak.Data;
using Microsoft.EntityFrameworkCore;
using CreativePeak.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CreativePeak.Core.Models;
using System.Linq.Expressions;

namespace CreativePeak.Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly DataContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(DataContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }
        public async Task<T> AddAsync(T entity)
        {
            _dbSet.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
            _context.SaveChanges();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            await _context.DesignersDetails.Include(b => b.Images).ToListAsync();
            await _context.Categories.Include(b => b.Images).ToListAsync();
            await _context.Users.Include(b => b.DesignersDetails).ToListAsync();
            return await _dbSet.ToListAsync();
        }

        public T? GetById(int id)
        {
            _context.DesignersDetails.Include(b => b.Images).ToListAsync();
            _context.Categories.Include(b => b.Images).ToListAsync();
            _context.Users.Include(b => b.DesignersDetails).ToListAsync();
            return _dbSet.Find(id);
        }

        public T Update(T entity)
        {
            _context.DesignersDetails.Include(b => b.Images).ToListAsync();
            _context.Categories.Include(b => b.Images).ToListAsync();
            _context.Users.Include(b => b.DesignersDetails).ToListAsync();
            _dbSet.Update(entity);
            _context.SaveChanges();
            return entity;
        }
    }
}
