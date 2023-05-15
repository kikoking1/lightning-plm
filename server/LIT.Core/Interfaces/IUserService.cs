using LIT.Core.Models;

namespace LIT.Core.Interfaces;

public interface IUserService
{
    Task<ResultType<UserDto>> RegisterAsync(UserLogin user);
    Task<ResultType<LoginTokens>> LoginAsync(UserLogin userLogin);
}