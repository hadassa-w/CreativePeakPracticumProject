using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core.IRepositories
{
    public interface IAuthRepository
    {
        Task<User> GetByCondition(Expression<Func<User, bool>> expression);
        Task<User> CreateUserAsync(User user);
    }
}
