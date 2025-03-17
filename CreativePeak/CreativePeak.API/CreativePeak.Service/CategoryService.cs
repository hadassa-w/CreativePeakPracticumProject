using CreativePeak.Core.IServices;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Service
{
    public class CategoryService : ICategoryService
    {
        private readonly IRepositoryManager _repositoryManager;

        public CategoryService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Category> AddAsync(Category category)
        {
            var newCategory = await _repositoryManager.Categories.AddAsync(category);
            _repositoryManager.Save();
            return newCategory;
        }

        public void Delete(Category category)
        {
            _repositoryManager.Categories.Delete(category);
            _repositoryManager.Save();
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _repositoryManager.Categories.GetAllAsync();
        }

        public Category? GetById(int id)
        {
            return _repositoryManager.Categories.GetById(id);
        }

        public Category? Update(int id, Category category)
        {
            var dbCategory = GetById(id);
            if (dbCategory == null)
            {
                return null;
            }
            dbCategory.CategoryName = category.CategoryName;
            dbCategory.Description = category.Description;
            dbCategory.CreatedAt = category.CreatedAt;
            dbCategory.UpdatedAt = category.UpdatedAt;

            _repositoryManager.Categories.Update(dbCategory);
            _repositoryManager.Save();
            return dbCategory;
        }

    }
}
