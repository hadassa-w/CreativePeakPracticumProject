using CreativePeak.Core.IServices;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Test
{
    public class UserTests
    {
        private readonly IUserService _userService;
        public UserTests(IUserService userService)
        {
            _userService = userService;
        }

        [Fact]
        public void GetAll_ReturnOk()
        {
            //Arrange

            //Act
            var result = _userService.GetAllAsync();

            //Assert
            Assert.IsType<List<User>>(result);
        }

        [Fact]
        public void Get_Id_IsOk()
        {
            //Arrange
            int id = 1;

            //Act
            var result = _userService.GetById(id);

            //Assert
            Assert.IsType<User>(result);
        }
    }
}
