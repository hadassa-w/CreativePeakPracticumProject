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
    public class ImageService : IImageService
    {
        private readonly IRepositoryManager _repositoryManager;

        public ImageService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<Image> AddAsync(Image image)
        {
            var newImage = await _repositoryManager.Images.AddAsync(image);
            _repositoryManager.Save();
            return newImage;
        }

        public void Delete(Image image)
        {
            _repositoryManager.Images.Delete(image);
            _repositoryManager.Save();
        }

        public async Task<IEnumerable<Image>> GetAllAsync()
        {
            return await _repositoryManager.Images.GetAllAsync();
        }

        public async Task<Image?> GetByIdAsync(int id)
        {
            return await _repositoryManager.Images.GetByIdAsync(id);
        }

        public async Task<Image?> UpdateAsync(int id, Image image)
        {
            var dbImage = await GetByIdAsync(id);
            if (dbImage == null)
            {
                return null;
            }
            dbImage.FileName = image.FileName;
            dbImage.Description = image.Description;
            //dbImage.DesignerDetails = image.DesignerDetails;
            //dbImage.Category = image.Category;
            dbImage.CreatedAt = image.CreatedAt;
            dbImage.UpdatedAt = image.UpdatedAt;

            await _repositoryManager.Images.UpdateAsync(dbImage);
            _repositoryManager.Save();
            return dbImage;
        }

    }
}
