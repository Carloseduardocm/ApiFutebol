using Microsoft.EntityFrameworkCore;
using ApiFutebol.Models;

namespace ApiFutebol.Data;

public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<ClubeEntity> Clubes => Set<ClubeEntity>();
}