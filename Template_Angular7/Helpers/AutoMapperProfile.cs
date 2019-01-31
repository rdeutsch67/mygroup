using AutoMapper;
using Template_Angular7.Data;
using Template_Angular7.Dtos;

namespace Template_Angular7.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppUser, UserDto>();
            CreateMap<UserDto, AppUser>();
        }
    }
}