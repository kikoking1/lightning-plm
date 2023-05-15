using Microsoft.EntityFrameworkCore;
using LIT.Core.Interfaces;
using LIT.Core.Models;
using LIT.Infrastructure.DbContexts;

namespace LIT.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    
    private readonly LITDbContext _litDbContext;
    
    public UserRepository(LITDbContext litDbContext)
    {
        _litDbContext = litDbContext;
    }
    
    public async Task<User?> GetByIdAsync(Guid userId)
    {
        return await _litDbContext.Users
            .FirstOrDefaultAsync(entity => entity.Id == userId);
    }
    
    public async Task<User?> RetrieveByUsernameAsync(string username)
    {
        return await _litDbContext.Users
            .FirstOrDefaultAsync(entity => entity.Username == username);
    }
    
    public async Task AddAsync(User user)
    {
        await _litDbContext.AddAsync(user);
        await _litDbContext.SaveChangesAsync();
    }
    
    public async Task UpdateAsync(User user)
    {
        user.DateModified = DateTime.UtcNow;

        _litDbContext.Update(user);
        await _litDbContext.SaveChangesAsync();
    }
}