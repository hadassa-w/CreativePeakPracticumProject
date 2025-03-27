using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IServices
{
    public interface IImageService
    {
        Task<IEnumerable<Image>> GetAllAsync();
        Task<Image?> GetByIdAsync(int id);
        Task<Image> AddAsync(Image image);
        Task<Image?> UpdateAsync(int id, Image image);
        void Delete(Image image);

    }
}
