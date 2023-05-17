using AutoFixture;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
using LIT.Application.Services;
using LIT.Core.Interfaces;
using LIT.Core.Models;
using Xunit;

namespace LIT.Tests;

public class ProductServiceTests
{
    private readonly IProductService _sut;
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly Fixture _fixture;

    public ProductServiceTests()
    {
        _fixture = new Fixture();
        _productRepositoryMock = new Mock<IProductRepository>();
        _tokenServiceMock = new Mock<ITokenService>();
        
        _sut = new ProductService(_productRepositoryMock.Object, _tokenServiceMock.Object);
    }
    
    [Fact]
    public async Task RetrieveProductByIdAsync_Should_Return_Status404NotFound_When_NotFound()
    {
        var userId = _fixture.Create<int>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });
        
        var id = _fixture.Create<int>();
        Product? product = null;

        _productRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<int>(), It.IsAny<int>()))
            .ReturnsAsync(product);
        
        var result = await _sut.RetrieveByIdAsync(id);

        result.Data.Should().Be(null);
        result.ErrorMessage?.ErrorMessage.Should().Be($"Product with id: {id} does not exist");
        result.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }
    
    [Fact]
    public async Task RetrieveProductByIdAsync_Should_Return_Status200OK_When_Found()
    {
        var userId = _fixture.Create<int>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });
        
        var product= _fixture.Create<Product>();

        _productRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<int>(), It.IsAny<int>()))
            .ReturnsAsync(product);
        
        var result = await _sut.RetrieveByIdAsync(It.IsAny<int>());

        result.Data.Should().NotBe(null);
        result.Data?.Name.Should().Be(product.Name);
        result.ErrorMessage?.ErrorMessage.Should().Be(null);
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }

    [Fact]
    public async Task RetrieveAsync_Should_Return_Status200OK_When_Valid_Limit_Offset_Parameters()
    {
        var userId = _fixture.Create<int>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });
        
        var products = _fixture.Create<List<Product>>();

        _productRepositoryMock
            .Setup(mock => mock.RetrieveAsync(It.IsAny<int>()))
            .ReturnsAsync(products);
        
        var result = await _sut.RetrieveAsync();

        result.Data.Should().NotBeEmpty();
        result.ErrorMessage?.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public async Task AddAsync_Should_Return_Status400BadRequest_When_Product_Body_Is_Empty()
    {
        var product= _fixture.Build<Product>()
            .With(x => x.Name, String.Empty)
            .Create();

        var result = await _sut.AddAsync(product);

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().Be("Product body cannot be empty");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }    
    
    [Fact]
    public async Task AddAsync_Should_Return_Status400BadRequest_When_GetSessionUserId_Fails_With_Status400BadRequest()
    {
        var product= _fixture.Build<Product>()
            .With(x => x.Name, _fixture.Create<string>())
            .Create();

        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = new APIError { ErrorMessage = "User is not logged in." }
            });

        var result = await _sut.AddAsync(product);

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().Be("User is not logged in.");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Fact]
    public async Task AddAsync_Should_Return_Status200OK_When_Product_Body_Is_Filled()
    {
        var product= _fixture.Build<Product>()
            .With(x => x.Name, _fixture.Create<string>())
            .Create();
        
        var userId = _fixture.Create<int>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });

        var result = await _sut.AddAsync(product);

        result.Data.Should().NotBeNull();
        result.Data?.Name.Should().Be(product.Name);
        result.Data?.UserId.Should().Be(userId);
        result.ErrorMessage?.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public async Task UpdateAsync_Should_Return_Status400BadRequest_When_Product_Id_Is_null()
    {
        var userId = _fixture.Create<int>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });
        
        var product = _fixture.Build<Product>()
            .With(x => x.Id, null as int?)
            .Create();

        var result = await _sut.UpdateAsync(product);

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().Be("Product id cannot be null");
        result.StatusCode.Should().Be(StatusCodes.Status400BadRequest);
    }
    
    [Fact]
    public async Task UpdateAsync_Should_Return_Status404NotFound_When_Product_Not_Found()
    {
        var userId = _fixture.Create<int>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });
        
        var product= _fixture.Build<Product>().Create();
        
        _productRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<int>(), It.IsAny<int>()))
            .ReturnsAsync(null as Product);
        
        var result = await _sut.UpdateAsync(product);

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().Be($"No productwith id: {product.Id} exists");
        result.StatusCode.Should().Be(StatusCodes.Status404NotFound);
    }
    
    [Fact]
    public async Task UpdateAsync_Should_Return_Status200OK_When_Successful()
    {
        var userId = _fixture.Create<int>();
        
        _tokenServiceMock
            .Setup(mock => mock.GetSessionUserId())
            .Returns(new ResultType<int>
            {
                StatusCode = StatusCodes.Status200OK,
                Data = userId
            });
        
        var product = _fixture.Build<Product>().Create();
        
        _productRepositoryMock
            .Setup(mock => mock.RetrieveByIdAsync(
                It.IsAny<int>(), It.IsAny<int>()))
            .ReturnsAsync(product);
        
        var result = await _sut.UpdateAsync(product);

        result.Data.Should().NotBeNull();
        result.Data?.UserId.Should().Be(product.UserId);
        result.Data?.DateCreated.Should().Be(product.DateCreated);
        result.Data?.DateModified.Should().Be(product.DateModified);
        result.ErrorMessage?.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
    
    [Fact]
    public void Delete_Should_Return_Status200OK_When_Successful()
    {
        var result = _sut.Delete(It.IsAny<int>());

        result.Data.Should().BeNull();
        result.ErrorMessage?.ErrorMessage.Should().BeNull();
        result.StatusCode.Should().Be(StatusCodes.Status200OK);
    }
}