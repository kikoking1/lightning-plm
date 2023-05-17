using LIT.Core.Models;

namespace LIT.Core.Interfaces;

public interface IProductRepository
{
    Task<Product?> RetrieveByIdAsync(int id, int userId);
    Task<List<Product>> RetrieveAsync(int userId);
    Task AddAsync(Product product);
    Task UpdateAsync(Product product);
    void Delete(int id);
}