using LIT.Core.Models;

namespace LIT.Core.Interfaces;

public interface IProductService
{
    Task<ResultType<Product>> RetrieveByIdAsync(Guid id);
    Task<ResultType<List<Product>>> RetrieveAsync();
    Task<ResultType<Product>> AddAsync(Product product);
    Task<ResultType<Product>> UpdateAsync(Product product);
    ResultType<object> Delete(Guid id);
}