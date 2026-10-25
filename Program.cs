using System.Text.Json;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
var app = builder.Build();
app.UseCors(policy => policy.AllowAnyOrigin()
    .AllowAnyHeader().AllowAnyMethod());
app.UseStaticFiles();

app.MapGet("/", () => "API do Futebol Brasileiro está no ar!");

app.MapGet("/api/clubes", async (ApiDbContext db) =>
{
    var clubes = await db.Clubes.ToListAsync();
    return Results.Ok(clubes);
});

app.MapGet("/api/clubes/{id:int}", async (int id, ApiDbContext db) =>
{
    var clubeEncontrado = await db.Clubes.FindAsync(id);
    if (clubeEncontrado is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(clubeEncontrado);
});

app.MapPost("/api/clubes", async (ClubeEntity dados, ApiDbContext db) =>
{
    db.Clubes.Add(dados);
    await db.SaveChangesAsync();
    return Results.Created($"/api/clubes/{dados.id}", dados);
});

app.MapPut("/api/clubes/{id:int}", async (int id, ClubeEntity dados, ApiDbContext db) =>
{
    var clubeEncontrado = await db.Clubes.FindAsync(id);
    if (clubeEncontrado is null)
    {
        return Results.NotFound();
    }
    clubeEncontrado.nome = dados.nome;
    clubeEncontrado.estado = dados.estado;
    clubeEncontrado.serieA = dados.serieA;
    await db.SaveChangesAsync();
    return Results.Ok(clubeEncontrado);
});

app.MapDelete("/api/clubes/{id:int}", async (int id, ApiDbContext db) =>
{
    var clubeEncontrado = await db.Clubes.FindAsync(id);
    if (clubeEncontrado is null)
    {
        return Results.NotFound();
    }
    db.Clubes.Remove(clubeEncontrado);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

class ClubeEntity
{
    public int id { get; set; }
    public string nome { get; set; }
    public string estado { get; set; }
    public bool serieA { get; set; }
}

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<ClubeEntity> Clubes => Set<ClubeEntity>();
}

record Clube(int id, string nome, string estado, bool serieA);
record ClubeDTO(string nome, string estado, bool serieA);
record ClubeAtualizadoDTO(string nome, string estado, bool serieA);