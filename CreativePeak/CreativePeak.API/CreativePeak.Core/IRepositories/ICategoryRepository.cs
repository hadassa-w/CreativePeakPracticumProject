using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IRepositories
{
    public interface ICategoryRepository
    {
        IEnumerable<Category> GetAll();
        Category? GetById(int id);
        Category Add(Category category);
        Category Update(Category category);
        void Delete(Category category);

    }
}
