using LIT.Core.Models;

namespace LIT.Core.Interfaces;

public interface IProductService
{
    Task<ResultType<ProductDto>> RetrieveByIdAsync(int id);
    Task<ResultType<List<ProductDto>>> RetrieveAsync();
    Task<ResultType<ProductDto>> AddAsync(ProductDto product);
    Task<ResultType<ProductDto>> UpdateAsync(ProductDto product);
    ResultType<object> Delete(int id);
}