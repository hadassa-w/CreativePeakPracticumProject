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
    public class ImageRepository : IImageRepository
    {
        private readonly DataContext _context;
        private readonly DbSet<Image> _dbSet;

        public ImageRepository(DataContext dataContext)
        {
            _context = dataContext;
            _dbSet = _context.Set<Image>();
        }
        public Image Add(Image image)
        {
            _dbSet.Add(image);
            _context.SaveChanges();
            return image;
        }

        public void Delete(Image image)
        {
            _dbSet.Remove(image);
            _context.SaveChanges();
        }

        public IEnumerable<Image> GetAll()
        {
            return _context.Images.ToList();
        }

        public Image? GetById(int id)
        {
            return _dbSet.Find(id);
        }

        public Image Update(Image image)
        {
            _dbSet.Update(image);
            _context.SaveChanges();
            return image;
        }

    }
}
