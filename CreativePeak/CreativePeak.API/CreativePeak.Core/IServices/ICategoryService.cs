using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IServices
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Category? GetById(int id);
        Task<Category> AddAsync(Category category);
        Category? Update(int id, Category category);
        void Delete(Category category);

    }
}
