using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LIT.Core.Interfaces;
using LIT.Core.Models;

namespace LIT.API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class ProductController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductController(
        IProductService productService)
    {
        _productService = productService;
    }
    
    [HttpGet]
    [Route("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Product>> RetrieveProductByIdAsync(Guid id)
    {
        var result = await _productService.RetrieveByIdAsync(id);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }
    
    [HttpGet]
    [Route("{offset}/{limit}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Product>> RetrieveProductsAsync()
    {
        var result = await _productService.RetrieveAsync();
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Product>> AddProdudct([FromBody] Product product)
    {
        var result = await _productService.AddAsync(product);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<Product>> UpdateProductAsync([FromBody] Product product)
    {
        var result = await _productService.UpdateAsync(product);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? (object) result.Data);
    }
    
    [HttpDelete]
    [Route("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult DeleteProduct(Guid id)
    {
        var result = _productService.Delete(id);
        return StatusCode(result.StatusCode, result.ErrorMessage ?? result.Data);
    }
}