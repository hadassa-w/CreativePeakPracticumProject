using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IRepositories
{
    public interface IRepositoryManager
    {
        IRepository<User> Users { get; }
        void Save();
    }
}
