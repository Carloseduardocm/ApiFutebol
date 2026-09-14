using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var clubes = new List<Clube>
{
    new Clube(1, "Internacional", "RS", true),
    new Clube(2, "Grêmio", "RS", true)
};

app.MapGet("/", () => "API do Futebol Brasileiro está no ar!");

app.MapGet("/api/clubes", () =>
{
    return Results.Ok(clubes);
});

app.MapGet("/api/clubes/{id:int}", (int id) =>
{
    var clubeEncontrado = clubes.Find(clube => clube.id == id);
    if (clubeEncontrado is null)
    {
        return Results.NotFound();
    }
    return Results.Ok(clubeEncontrado);
});

app.MapPost("/api/clubes", (ClubeDTO dados) =>
{
    int proximoId = clubes.Count > 0 ? clubes.Max(c => c.id) + 1 : 1;
    var novoClube = new Clube(proximoId, dados.nome, dados.estado, dados.serieA);
    clubes.Add(novoClube);
    return Results.Created($"/api/clubes/{novoClube.id}", novoClube);
});

app.MapPut("/api/clubes/{id:int}", (int id, ClubeAtualizadoDTO dados) =>
{
    int indice = clubes.FindIndex(clubeDaLista => clubeDaLista.id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    var atualizado = new Clube(id, dados.nome, dados.estado, dados.serieA);
    clubes[indice] = atualizado;
    return Results.Ok(atualizado);
});

app.MapDelete("/api/clubes/{id:int}", (int id) =>
{
    int indice = clubes.FindIndex(clubeDaLista => clubeDaLista.id == id);
    if (indice == -1)
    {
        return Results.NotFound();
    }
    clubes.RemoveAt(indice);
    return Results.NoContent();
});

app.Run();

record Clube(int id, string nome, string estado, bool serieA);
record ClubeDTO(string nome, string estado, bool serieA);
record ClubeAtualizadoDTO(string nome, string estado, bool serieA);