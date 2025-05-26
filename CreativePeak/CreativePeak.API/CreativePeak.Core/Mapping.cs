using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core
{
    public class Mapping
    {
        public User MappingUserDTO(User user)
        {
            return new User { Id = user.Id, FullName = user.FullName, Email = user.Email, Password = user.Password, Phone = user.Phone, Address = user.Address, CreatedAt = user.CreatedAt, UpdatedAt = user.UpdatedAt };
        }
        public Image MappingImageDTO(Image image)
        {
            return new Image { Id = image.Id, FileName = image.FileName, Description = image.Description, CreatedAt = image.CreatedAt, UpdatedAt = image.UpdatedAt };
        }
        public DesignerDetails MappingDesignerDetailsDTO(DesignerDetails designerDetails)
        {
            return new DesignerDetails { Id = designerDetails.Id, FullName = designerDetails.FullName, AddressSite = designerDetails.AddressSite, Email = designerDetails.Email, Phone = designerDetails.Phone, YearsExperience = designerDetails.YearsExperience, PriceRangeMin = designerDetails.PriceRangeMin, PriceRangeMax = designerDetails.PriceRangeMax, Description = designerDetails.Description, CreatedAt = designerDetails.CreatedAt, UpdatedAt = designerDetails.UpdatedAt };
        }
        public Category MappingCategoryDTO(Category category)
        {
            return new Category { Id = category.Id, CategoryName = category.CategoryName, Description = category.Description, CreatedAt = category.CreatedAt, UpdatedAt = category.UpdatedAt };
        }
    }
}
