using CreativePeak.Data;
using ShowrealPro.Core.IRepositories;
using ShowrealPro.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly DataContext _context;
        private readonly IRepository<User> _users;

        public RepositoryManager(DataContext context, IRepository<User> userRepository)
        {
            _context = context;
            _users = userRepository;
        }

        public IRepository<User> Users => _users;

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
