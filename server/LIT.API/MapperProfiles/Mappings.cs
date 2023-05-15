using AutoMapper;
using LIT.Core.Models;

namespace LIT.API.MapperProfiles;

public class Mappings : Profile
{
    public Mappings()
    {
        //ignore non matching members
        CreateMap<User, UserDto>();
        CreateMap<UserDto, User>();
    }
}