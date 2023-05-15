using LIT.Core.Models;

namespace LIT.Core.Interfaces;

public interface IProductRepository
{
    Task<Product?> RetrieveByIdAsync(Guid id, Guid userId);
    Task<List<Product>> RetrieveAsync(Guid userId);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    void Delete(Guid id);
}