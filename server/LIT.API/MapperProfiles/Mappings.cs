using AutoMapper;
using LIT.Core.Models;

namespace LIT.API.MapperProfiles;

public class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<User, UserDto>();
        CreateMap<UserDto, User>();
        CreateMap<NewUser, User>();
        CreateMap<Product, ProductDto>();
        CreateMap<ProductDto, Product>();
    }
}