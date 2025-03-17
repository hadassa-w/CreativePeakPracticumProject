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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<Category> _dbSet;

        public CategoryRepository(DataContext dataContext)
        {
            _context = dataContext;
            _dbSet = _context.Set<Category>();
        }
        public Category Add(Category category)
        {
            _dbSet.Add(category);
            _context.SaveChanges();
            return category;
        }

        public void Delete(Category category)
        {
            _dbSet.Remove(category);
            _context.SaveChanges();
        }

        public IEnumerable<Category> GetAll()
        {
            return _context.Categories.ToList();
        }

        public Category? GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public Category Update(Category category)
        {
            _dbSet.Update(category);
            _context.SaveChanges();
            return category;
        }

    }
}
