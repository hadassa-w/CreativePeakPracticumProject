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
    public class ViewRepository : IViewRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<View> _dbSet;

        public ViewRepository(DataContext dataContext)
        {
            _context = dataContext;
            _dbSet = _context.Set<View>();
        }
        public View Add(View view)
        {
            _dbSet.Add(view);
            _context.SaveChanges();
            return view;
        }

        public void Delete(View view)
        {
            _dbSet.Remove(view);
            _context.SaveChanges();
        }

        public IEnumerable<View> GetAll()
        {
            return _context.Views.ToList();
        }

        public View? GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public View Update(View view)
        {
            _dbSet.Update(view);
            _context.SaveChanges();
            return view;
        }

    }
}
