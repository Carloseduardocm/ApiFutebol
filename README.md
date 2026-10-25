# API Futebol

API REST para gerenciamento de clubes do futebol brasileiro com persistência em banco de dados SQLite via Entity Framework Core e interface web integrada (frontend), desenvolvida com ASP.NET Core e .NET 10.

## Requisitos

- .NET SDK 10.0 ou superior
- Ferramenta de linha de comando do Entity Framework Core (`dotnet-ef`)
  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Preparação do Banco de Dados

Antes de iniciar a aplicação pela primeira vez ou após alterações em modelos, aplique as migrações para criar e atualizar o banco SQLite local (`api-futebol.db`):

```bash
dotnet ef database update
```

## Como executar

Na raiz do projeto, execute:

```bash
dotnet run --urls http://localhost:5050
```

A API e os arquivos estáticos estarão disponíveis em:
* `http://localhost:5050`

Para verificar se a API está funcionando:

```http
GET http://localhost:5050/
```

Resposta esperada:

```text
API do Futebol Brasileiro está no ar!
```

### Como abrir a interface (Frontend)

Com a API em execução, abra o seu navegador e acesse:
* `http://localhost:5050/index.html`

A tela carregará a listagem conectada em tempo real com os endpoints da API, permitindo cadastrar, editar e excluir clubes diretamente pela interface gráfica.

---

## Endpoints da API

| Método | Rota | Descrição | Status de Sucesso |
| --- | --- | --- | --- |
| GET | `/` | Rota raiz de teste | `200 OK` |
| GET | `/api/clubes` | Lista todos os clubes | `200 OK` |
| GET | `/api/clubes/{id}` | Busca um clube por ID | `200 OK` (ou `404 Not Found`) |
| POST | `/api/clubes` | Cadastra um novo clube | `201 Created` |
| PUT | `/api/clubes/{id}` | Atualiza um clube existente | `200 OK` (ou `404 Not Found`) |
| DELETE | `/api/clubes/{id}` | Remove um clube | `204 NoContent` (ou `404 Not Found`) |

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
  "nome": "Internacional",
  "estado": "RS",
  "serieA": true
}
```

### Atualizar clube

```http
PUT /api/clubes/3
Content-Type: application/json

{
  "nome": "Sport Club Internacional",
  "estado": "RS",
  "serieA": true
}
```

### Remover clube

```http
DELETE /api/clubes/3
```

---

## Observações

* Os dados são persistidos localmente no banco de dados SQLite (`api-futebol.db`) via Entity Framework Core e permanecem armazenados mesmo após reiniciar o servidor.
* Operações de busca, atualização ou exclusão direcionadas a um ID inexistente retornam HTTP `404 Not Found`.
* O cadastro retorna HTTP `201 Created` e a remoção bem-sucedida retorna HTTP `204 No Content`.
* Os arquivos do frontend residem na pasta `/wwwroot` e são servidos na mesma origem da aplicação.
* A collection de testes do Bruno está localizada na pasta `/bruno` deste repositório.

---

## Vídeo de demonstração — AP2

* [Clique aqui para assistir ao vídeo da AP2]()

*(Vídeo anterior da AP1 mantido para histórico: [Vídeo AP1](https://drive.google.com/file/d/1Y7Q1FddKsqxdmB6q8JCpimrgIahJCzzA/view?usp=sharing))*