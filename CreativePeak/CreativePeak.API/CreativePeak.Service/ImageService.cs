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

        public Image? GetById(int id)
        {
            return _repositoryManager.Images.GetById(id);
        }

        public Image? Update(int id, Image image)
        {
            var dbImage = GetById(id);
            if (dbImage == null)
            {
                return null;
            }
            dbImage.FileName = image.FileName;
            dbImage.Description = image.Description;
            dbImage.DesignerId = image.DesignerId;
            dbImage.CategoryId = image.CategoryId;
            dbImage.CreatedAt = image.CreatedAt;
            dbImage.UpdatedAt = image.UpdatedAt;

            _repositoryManager.Images.Update(dbImage);
            _repositoryManager.Save();
            return dbImage;
        }

    }
}
