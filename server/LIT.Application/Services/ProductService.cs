using AutoMapper;
using Microsoft.AspNetCore.Http;
using LIT.Core.Interfaces;
using LIT.Core.Models;

namespace LIT.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public ProductService(
        IProductRepository productRepository,
        ITokenService tokenService,
        IMapper mapper)
    {
        _productRepository = productRepository;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    public async Task<ResultType<ProductDto>> RetrieveByIdAsync(int id)
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        var userId = sessionUserIdResult.Data;
        
        var product = await _productRepository.RetrieveByIdAsync(id, userId);
        
        if (product == null)
        {
            return new ResultType<ProductDto>
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = new APIError{ErrorMessage = $"Product with id: {id} does not exist"}
            };
        }
        
        var productDto = _mapper.Map<ProductDto>(product);
        
        return new ResultType<ProductDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = productDto
        };
    }    
    
    public async Task<ResultType<List<ProductDto>>> RetrieveAsync()
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        var userId = sessionUserIdResult.Data;

        var productDtos = _mapper.Map<List<ProductDto>>(await _productRepository.RetrieveAsync(userId));

        return new ResultType<List<ProductDto>>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = productDtos
        };
    }
    
    public async Task<ResultType<ProductDto>> AddAsync(ProductDto productDto)
    {
        if (productDto.Name == String.Empty)
        {
            return new ResultType<ProductDto>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = new APIError{ ErrorMessage = "Product name cannot be empty"},
            };
        }
        
        var userIdResult = _tokenService.GetSessionUserId();
        if (userIdResult.ErrorMessage != null)
        {
            return new ResultType<ProductDto>
            {
                StatusCode = userIdResult.StatusCode,
                ErrorMessage = userIdResult.ErrorMessage
            };
        }
        
        var userId = userIdResult.Data;
        var product = _mapper.Map<Product>(productDto);
        product.UserId = userId;
        
        await _productRepository.AddAsync(product);
        
        productDto = _mapper.Map<ProductDto>(product);
        
        return new ResultType<ProductDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = productDto
        };
    }
    
    public async Task<ResultType<ProductDto>> UpdateAsync(ProductDto productDto)
    {
        var sessionUserIdResult = _tokenService.GetSessionUserId();
        
        if (sessionUserIdResult.ErrorMessage != null)
        {
            return new ResultType<ProductDto>
            {
                StatusCode = sessionUserIdResult.StatusCode,
                ErrorMessage = sessionUserIdResult.ErrorMessage
            };
        }
        
        var userId = sessionUserIdResult.Data;
        
        if (productDto.Id == null)
        {
            return new ResultType<ProductDto>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = new APIError{ ErrorMessage = "Product id cannot be null" }
            };
        }
        
        var existingProduct = await _productRepository.RetrieveByIdAsync(productDto.Id.Value, userId);

        if (existingProduct == null)
        {
            return new ResultType<ProductDto>
            {
                StatusCode = StatusCodes.Status404NotFound,
                ErrorMessage = new APIError{ ErrorMessage = $"No product with id: {productDto.Id} exists" }
            };
        }
        
        var product = _mapper.Map(productDto, existingProduct);
        await _productRepository.UpdateAsync(product);
        
        productDto = _mapper.Map<ProductDto>(product);

        return new ResultType<ProductDto>
        {
            StatusCode = StatusCodes.Status200OK,
            Data = productDto,
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