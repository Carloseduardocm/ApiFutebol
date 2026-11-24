using Microsoft.EntityFrameworkCore;
using ApiFutebol.Models;
using ApiFutebol.Data;
using ApiFutebol.Dtos;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();
builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsJsonAsync(new
        {
            mensagem = "Ocorreu um erro interno. Tente novamente mais tarde."
        });
    });
});

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

app.MapPost("/api/clubes", async (ClubeDTO dados, ApiDbContext db) =>
{
    var novoClube = new ClubeEntity
    {
        nome = dados.nome,
        estado = dados.estado,
        serieA = dados.serieA
    };

    db.Clubes.Add(novoClube);
    await db.SaveChangesAsync();
    return Results.Created($"/api/clubes/{novoClube.id}", novoClube);
});

app.MapPut("/api/clubes/{id:int}", async (int id, ClubeAtualizadoDTO dados, ApiDbContext db) =>
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