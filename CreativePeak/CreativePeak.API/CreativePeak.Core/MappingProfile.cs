using AutoMapper;
using CreativePeak.Core.DTOs;
using CreativePeak.Core.Models;
using CreativePeak.Core.PostModels;
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
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<DesignerDetails, DesignerDetailsDTO>().ReverseMap();

            CreateMap<User, UserPostModel>().ReverseMap();
            CreateMap<Image, ImagePostModel>().ReverseMap();
            CreateMap<Category, CategoryPostModel>().ReverseMap();
            CreateMap<DesignerDetails, DesignerDetailsPostModel>().ReverseMap();

            CreateMap<Category, NewCategoryDTO>().ReverseMap();
            CreateMap<DesignerDetails, NewDesignerDetailsDTO>().ReverseMap();
        }

    }
}
