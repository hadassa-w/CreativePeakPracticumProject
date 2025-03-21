using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IServices
{
    public interface IViewService
    {
        Task<IEnumerable<View>> GetAllAsync();
        View? GetById(int id);
        Task<View> AddAsync(View view);
        View? Update(int id, View view);
        void Delete(View view);

    }
}
