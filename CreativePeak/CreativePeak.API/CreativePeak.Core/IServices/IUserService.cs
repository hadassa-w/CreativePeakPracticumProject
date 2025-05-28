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
        Task<User?> GetByIdAsync(int id);
        Task<User> AddAsync(User user);
        Task<User?> UpdateAsync(int id, User user);
        void Delete(User user);


        Task<bool> ForgotPasswordAsync(string email);
        Task<User?> AuthenticateAsync(string email, string password);

        Task<bool> ChangePasswordAsync(string email, string newPassword);

        Task<User?> GetUserByEmailAsync(string email);

        string GenerateTemporaryPassword();

        Task SendTemporaryPasswordEmailAsync(string email, string temporaryPassword, string firstName);

        //Task<bool> ForgotPasswordAsync(string email);
        //Task<bool> ResetPasswordAsync(string token, string newPassword);
        //Task<User?> GetUserByEmailAsync(string email);
    }
}
