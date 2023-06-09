using AutoFixture;
using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using LIT.API.MapperProfiles;
using LIT.Application.Services;
using LIT.Core.Interfaces;
using LIT.Core.Models;
using Xunit;

namespace LIT.Tests;

public class UserServiceTests
{
    private readonly IUserService _sut;
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly IMapper _mapper;
    
    private readonly Fixture _fixture;

    public UserServiceTests()
    {
        _fixture = new Fixture();
        _mapper = new Mapper(new MapperConfiguration(config => config.AddProfile<Mappings>()));
        _userRepositoryMock = new Mock<IUserRepository>();
        
        Mock<ITokenService> tokenServiceMock = new();
        tokenServiceMock
            .Setup(mock => mock.CreateAccessToken(It.IsAny<User>()))
            .Returns(_fixture.Create<string>());

        _sut = new UserService(_userRepositoryMock.Object, tokenServiceMock.Object, _mapper);
    }
    
    [Fact]
    public async Task RegisterAsync_Should_Return_Status400BadRequest_When_Username_Not_Available()
    {
        var newUser = _fixture.Create<NewUser>();
        var existingUser = _fixture.Create<User>();
        
        _userRepositoryMock
            .Setup(mock => mock.RetrieveByUsernameAsync(
                It.IsAny<string>()))
            .ReturnsAsync(existingUser);
        
        var result = await _sut.RegisterAsync(newUser);

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().Be($"User with username: {newUser.Username} is not available.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }

    [Fact]
    public async Task RegisterAsync_Should_Return_Status200OK_When_Successful()
    {
        var newUser = _fixture.Create<NewUser>();

        _userRepositoryMock
            .Setup(mock => mock.RetrieveByUsernameAsync(
                It.IsAny<string>()))
            .ReturnsAsync(null as User);
        
        var result = await _sut.RegisterAsync(newUser);

        result.Data.Should().NotBeNull();
        result.Data?.Username.Should().Be(newUser.Username);
        result.ErrorMessage?.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public async Task LoginAsync_Should_Return_Status400BadRequest_When_User_Not_Found()
    {
        var userLogin = _fixture.Create<UserLogin>();

        _userRepositoryMock
            .Setup(mock => mock.RetrieveByUsernameAsync(
                It.IsAny<string>()))
            .ReturnsAsync(null as User);
        
        var result = await _sut.LoginAsync(userLogin);

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().Be("Invalid username or password.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Fact]
    public async Task LoginAsync_Should_Return_Status400BadRequest_When_Invalid_Password()
    {
        var password = _fixture.Create<string>();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword($"{password}-NotTheSame");
        
        var existingUser = _fixture.Build<User>()
            .With(x => x.PasswordHash, passwordHash)
            .Create();
        
        var userLogin = _fixture.Build<UserLogin>()
            .With(x => x.Password, password)
            .Create();

        _userRepositoryMock
            .Setup(mock => mock.RetrieveByUsernameAsync(
                It.IsAny<string>()))
            .ReturnsAsync(existingUser);
        
        var result = await _sut.LoginAsync(userLogin);

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().Be("Invalid username or password.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
        
    [Fact]
    public async Task LoginAsync_Should_Return_JwtToken_When_Login_Is_Valid()
    {
        var password = _fixture.Create<string>();
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        
        var existingUser = _fixture.Build<User>()
            .With(x => x.PasswordHash, passwordHash)
            .Create();
        
        var userLogin = _fixture.Build<UserLogin>()
            .With(x => x.Password, password)
            .Create();

        _userRepositoryMock
            .Setup(mock => mock.RetrieveByUsernameAsync(
                It.IsAny<string>()))
            .ReturnsAsync(existingUser);
        
        var result = await _sut.LoginAsync(userLogin);

        result.Data.Should().NotBeNull();
        result.ErrorMessage?.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
}