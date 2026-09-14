# API Futebol

API REST minimalista para gerenciamento de clubes do futebol brasileiro, desenvolvida com ASP.NET Core e .NET 10.

## Requisitos

- .NET SDK 10.0 ou superior

## Como executar

Na raiz do projeto, execute:

```bash
dotnet run --urls http://localhost:5050

```

A API estará disponível em:

* HTTP: `http://localhost:5050`

Para verificar se a API está funcionando:

```http
GET http://localhost:5050/

```

Resposta esperada:

```text
API do Futebol Brasileiro está no ar!

```

## Endpoints

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/clubes` | Lista todos os clubes |
| GET | `/api/clubes/{id}` | Busca um clube pelo ID |
| POST | `/api/clubes` | Cadastra um novo clube |
| PUT | `/api/clubes/{id}` | Atualiza um clube existente |
| DELETE | `/api/clubes/{id}` | Remove um clube |

### Listar clubes

```http
GET /api/clubes

```

### Buscar clube por ID

```http
GET /api/clubes/1

```

### Cadastrar clube

```http
POST /api/clubes
Content-Type: application/json

{
  "nome": "Palmeiras",
  "estado": "SP",
  "serieA": true
}

```

### Atualizar clube

```http
PUT /api/clubes/3
Content-Type: application/json

{
  "nome": "Sociedade Esportiva Palmeiras",
  "estado": "SP",
  "serieA": true
}

```

### Remover clube

```http
DELETE /api/clubes/3

```

## Observacoes

* A aplicacao inicia com os clubes `Internacional` e `Grêmio`.
* Os dados ficam armazenados somente em memoria e sao perdidos ao reiniciar a aplicacao.
* Operacoes para um ID inexistente retornam HTTP `404 Not Found`.
* O cadastro retorna HTTP `201 Created` e a remocao bem-sucedida retorna HTTP `204 No Content`.
* A collection de testes do Bruno esta localizada na pasta `/bruno` deste repositorio.

## Video de demonstracao

* [Clique aqui para assistir](https://drive.google.com/drive/folders/10chpoIbk9IV8ZFmPCmjQS6ukbGRwp23D?usp=drive_link)