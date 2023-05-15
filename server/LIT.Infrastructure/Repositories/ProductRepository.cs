using Microsoft.EntityFrameworkCore;
using LIT.Core.Interfaces;
using LIT.Core.Models;
using LIT.Infrastructure.DbContexts;

namespace LIT.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly LITDbContext _litDbContext;
    
    public ProductRepository(LITDbContext litDbContext)
    {
        _litDbContext = litDbContext;
    }

    public async Task<Product?> RetrieveByIdAsync(Guid id, Guid userId)
    {
        return await _litDbContext.Products
            .Where(product=> product.Id == id)
            .FirstOrDefaultAsync();
    }
    
    public async Task<List<Product>> RetrieveAsync(int offset, int limit, Guid userId)
    {
        return await _litDbContext.Products
            .OrderByDescending(b => b.DateCreated)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }
    
    public async Task AddAsync(Product product)
    {
        product.Id = Guid.NewGuid();
        product.DateCreated = DateTime.UtcNow;
        product.DateModified = DateTime.UtcNow;

        await _litDbContext.AddAsync(product);
        await _litDbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        product.DateModified = DateTime.UtcNow;

        _litDbContext.Update(product);
        await _litDbContext.SaveChangesAsync();
    }
    
    public void Delete(Guid id)
    {
        _litDbContext.Remove(_litDbContext.Products.Single(a => a.Id == id));
        _litDbContext.SaveChanges();
    }
}