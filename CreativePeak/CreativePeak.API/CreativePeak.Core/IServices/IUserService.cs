using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        User? GetById(int id);
        Task<User> AddAsync(User user);
        User? Update(int id, User user);
        void Delete(User user);

    }
}
