using CreativePeak.Core.IServices;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Service
{
    public class UserService : IUserService
    {
        private readonly IRepositoryManager _repositoryManager;

        public UserService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<User> AddAsync(User user)
        {
            var newUser = await _repositoryManager.Users.AddAsync(user);
            _repositoryManager.Save();
            return newUser;
        }

        public void Delete(User user)
        {
            _repositoryManager.Users.Delete(user);
            _repositoryManager.Save();
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _repositoryManager.Users.GetAllAsync();
        }

        public User? GetById(int id)
        {
            return _repositoryManager.Users.GetById(id);
        }

        public User? Update(int id, User user)
        {
            var dbUser = GetById(id);
            if (dbUser == null)
            {
                return null;
            }
            dbUser.FullName = user.FullName;
            dbUser.Email = user.Email;
            dbUser.Password = user.Password;
            dbUser.Phone = user.Phone;
            dbUser.Address = user.Address;
            dbUser.CreatedAt = user.CreatedAt;
            dbUser.UpdatedAt = user.UpdatedAt;

            _repositoryManager.Users.Update(dbUser);
            _repositoryManager.Save();
            return dbUser;
        }

    }
}
