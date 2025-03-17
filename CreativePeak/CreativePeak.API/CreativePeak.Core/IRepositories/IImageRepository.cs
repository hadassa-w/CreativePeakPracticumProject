using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IRepositories
{
    public interface IImageRepository
    {
        IEnumerable<Image> GetAll();
        Image? GetById(int id);
        Image Add(Image image);
        Image Update(Image image);
        void Delete(Image image);

    }
}
