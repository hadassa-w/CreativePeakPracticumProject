using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IRepositories
{
    public interface IUserRepository
    {
        IEnumerable<User> GetAll();
        User? GetById(int id);
        User Add(User user);
        User Update(User user);
        void Delete(User user);


        Task<User?> GetByEmailAsync(string email);

        Task UpdateAsync(User user);

        Task CleanExpiredTemporaryPasswordsAsync();
  //Task<User?> GetByEmailAsync(string email);
  //      Task<User?> GetByPasswordResetTokenAsync(string token);
  //      Task UpdateAsync(User user);
    }
}
