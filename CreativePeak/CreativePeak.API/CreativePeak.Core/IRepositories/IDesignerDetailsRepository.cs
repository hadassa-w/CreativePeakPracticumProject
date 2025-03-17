using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IRepositories
{
    public interface IDesignerDetailsRepository
    {
        IEnumerable<DesignerDetails> GetAll();
        DesignerDetails? GetById(int id);
        DesignerDetails Add(DesignerDetails designerDetails);
        DesignerDetails Update(DesignerDetails designerDetails);
        void Delete(DesignerDetails designerDetails);

    }
}
