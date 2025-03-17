using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IServices
{
    public interface IDesignerDetailsService
    {
        Task<IEnumerable<DesignerDetails>> GetAllAsync();
        DesignerDetails? GetById(int id);
        Task<DesignerDetails> AddAsync(DesignerDetails designerDetails);
        DesignerDetails? Update(int id, DesignerDetails designerDetails);
        void Delete(DesignerDetails designerDetails);

    }
}
