using Microsoft.AspNetCore.Http;
using LIT.Core.Interfaces;
using LIT.Core.Models;

namespace LIT.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ITokenService _tokenService;

    public ProductService(
        IProductRepository productRepository,
        ITokenService tokenService)
    {
        _productRepository = productRepository;
        _tokenService = tokenService;
    }

    public async Task<ResultType<Product>> RetrieveByIdAsync(int id)
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        var userId = sessionUserIdResult.Data;
        
        var product= await _productRepository.RetrieveByIdAsync(id, userId);
        
        if (product== null)
        {
            return new ResultType<Product>
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = new APIError{ErrorMessage = $"Product with id: {id} does not exist"}
            };
        }
        
        return new ResultType<Product>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = product
        };
    }    
    
    public async Task<ResultType<List<Product>>> RetrieveAsync()
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        var userId = sessionUserIdResult.Data;

        return new ResultType<List<Product>>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = await _productRepository.RetrieveAsync(userId)
        };
    }
    
    public async Task<ResultType<Product>> AddAsync(Product product)
    {
        if (product.Name == String.Empty)
        {
            return new ResultType<Product>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = new APIError{ ErrorMessage = "Product body cannot be empty"},
            };
        }
        
        var userIdResult = _tokenService.GetSessionUserId();
        if (userIdResult.ErrorMessage != null)
        {
            return new ResultType<Product>
            {
                StatusCode = userIdResult.StatusCode,
                ErrorMessage = userIdResult.ErrorMessage
            };
        }
        
        var userId = userIdResult.Data;
        product.UserId = userId;
        
        await _productRepository.AddAsync(product);
        
        return new ResultType<Product>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = product
        };
    }
    
    public async Task<ResultType<Product>> UpdateAsync(Product product)
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        if (sessionUserIdResult.ErrorMessage != null)
        {
            return new ResultType<Product>
            {
                StatusCode = sessionUserIdResult.StatusCode,
                ErrorMessage = sessionUserIdResult.ErrorMessage
            };
        }
        
        var userId = sessionUserIdResult.Data;
        
        if (product.Id == null)
        {
            return new ResultType<Product>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = new APIError{ ErrorMessage = "Product id cannot be null" }
            };
        }
        
        var existingProduct = await _productRepository.RetrieveByIdAsync(product.Id.Value, userId);

        if (existingProduct == null)
        {
            return new ResultType<Product>
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = new APIError{ ErrorMessage = $"No productwith id: {product.Id} exists" }
            };
        }
        
        await _productRepository.UpdateAsync(product);

        return new ResultType<Product>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = product,
        };
    }
    
    public ResultType<object> Delete(int id)
    {
        _productRepository.Delete(id);
        
        return new ResultType<object>
        {
            StatusCode = StatusCodes.Status200OK,
        };
    }
}