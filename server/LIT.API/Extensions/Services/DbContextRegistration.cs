using System.Reflection;
using Microsoft.EntityFrameworkCore;
using LIT.Infrastructure.DbContexts;

namespace LIT.API.Extensions.Services;

public static class DbContextRegistration
{
    public static void AddDbContexts(this IServiceCollection collection, ConfigurationManager config)
    {
        var sqliteConnectionString = config.GetSection("SqliteConnection")["ConnectionString"];

        collection.AddDbContext<LITDbContext>(options =>
            options.UseSqlite(sqliteConnectionString, option =>
            {
                option.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
            })
        );
    }
}