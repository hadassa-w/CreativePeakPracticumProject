using CreativePeak.Data;
using Microsoft.EntityFrameworkCore;
using ShowrealPro.Core.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            //await _context.Users.Include(b => b.).ToListAsync();
            return await _dbSet.ToListAsync();
        }

        public T? GetById(int id)
        {
            //_context.Users.Include(b => b.).Where(book => book.Id == id).ToList();
            return _dbSet.Find(id);
        }

        public T Update(T entity)
        {
            //_context.Users.Include(b => b.).ToList();
            _dbSet.Update(entity);
            _context.SaveChanges();
            return entity;
        }
    }
}
