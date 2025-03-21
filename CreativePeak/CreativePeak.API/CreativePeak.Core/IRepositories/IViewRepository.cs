using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IRepositories
{
    public interface IViewRepository
    {
        IEnumerable<View> GetAll();
        View? GetById(int id);
        View Add(View view);
        View Update(View view);
        void Delete(View view);

    }
}
