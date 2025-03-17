using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core
{
    public class Mapping
    {
        public User MappingUserDTO(User user)
        {
            return new User { Id = user.Id, FullName = user.FullName, Email = user.Email, Password = user.Password, Phone = user.Phone, Address = user.Address, CreatedAt = user.CreatedAt, UpdatedAt = user.UpdatedAt };
        }
    }
}
