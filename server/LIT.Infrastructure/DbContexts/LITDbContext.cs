using Microsoft.EntityFrameworkCore;
using LIT.Core.Models;

namespace LIT.Infrastructure.DbContexts;

public class LITDbContext : DbContext
{
    public LITDbContext(DbContextOptions<LITDbContext> options)
        : base(options)
    {
    }
    
    public virtual DbSet<Product> Products { get; set; }
    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .ToTable("Products");
        modelBuilder.Entity<User>()
            .ToTable("Users")
            .HasMany(e => e.Products);
        
        base.OnModelCreating(modelBuilder);
    }
}