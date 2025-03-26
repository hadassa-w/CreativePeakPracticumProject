using AutoMapper;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CreativePeak.Core
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<Image, ImageDTO>().ReverseMap();
            CreateMap<DesignerDetails, DesignerDetailsDTO>().ReverseMap();
            CreateMap<Category, CategoryDTO>().ReverseMap();
        }

    }
}
