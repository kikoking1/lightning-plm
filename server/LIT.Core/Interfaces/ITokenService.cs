using LIT.Core.Models;

namespace LIT.Core.Interfaces;

public interface ITokenService
{
    ResultType<int> GetSessionUserId();
    string CreateAccessToken(User user);
    string CreateRefreshToken(User user);
    Task<ResultType<LoginTokens>> RefreshLoginTokensAsync(string refreshToken);
}