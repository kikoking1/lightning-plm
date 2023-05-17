using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using LIT.Core.Configuration;
using LIT.Core.Interfaces;
using LIT.Core.Models;

namespace LIT.Application.Services;

public class UserService : IUserService
{
    private const string FailedLoginMessage = "Invalid username or password.";
    
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    
    public UserService(IUserRepository userRepository,
        ITokenService tokenService,
        IMapper mapper)
    {
        _mapper = mapper;
        _userRepository = userRepository;
        _tokenService = tokenService;
    }

    public async Task<ResultType<UserDto>> RegisterAsync(NewUser newUser)
    {
        var existingUser = await _userRepository.RetrieveByUsernameAsync(newUser.Username);
        
        if (existingUser != null)
        {
            return new ResultType<UserDto>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = $"User with username: {newUser.Username} is not available.",
            };
        }

        var passwordHash
            = BCrypt.Net.BCrypt.HashPassword(newUser.Password);
        
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = newUser.Username,
            FirstName = newUser.FirstName,
            LastName = newUser.LastName,
            PasswordHash = passwordHash,
            DateCreated = DateTime.UtcNow,
            DateModified = DateTime.UtcNow,
        };

        await _userRepository.AddAsync(user);
        
        var userDto = _mapper.Map<UserDto>(user);
        
        return new ResultType<UserDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = userDto
        };
    }

    public async Task<ResultType<LoginTokens>> LoginAsync(UserLogin userLogin)
    {
        var existingUser = await _userRepository.RetrieveByUsernameAsync(userLogin.Username);
        
        if (existingUser == null)
        {
            return new ResultType<LoginTokens>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = FailedLoginMessage,
            };
        }

        if (!BCrypt.Net.BCrypt.Verify(userLogin.Password, existingUser.PasswordHash))
        {
            return new ResultType<LoginTokens>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = FailedLoginMessage,
            };
        }

        var token = _tokenService.CreateAccessToken(existingUser);
        var refreshToken = _tokenService.CreateRefreshToken(existingUser);

        return new ResultType<LoginTokens>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = new LoginTokens
            {
                AccessToken = token,
                RefreshToken = refreshToken,
            }
        };
    }
}