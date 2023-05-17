using LIT.Core.Models;

namespace LIT.Core.Interfaces;

public interface IUserService
{
    Task<ResultType<UserDto>> RegisterAsync(NewUser user);
    Task<ResultType<LoginTokens>> LoginAsync(UserLogin userLogin);
}