# API Futebol

## Objetivo e Tema

API REST desenvolvida em **ASP.NET Core (.NET 10)** para o gerenciamento completo (CRUD) de clubes do futebol brasileiro, com persistência relacional em **SQLite** via **Entity Framework Core**, tratamento centralizado de exceções e interface web integrada (frontend).

---

## Requisitos

* [.NET SDK 10.0](https://dotnet.microsoft.com/) ou superior
* Ferramenta de linha de comando do Entity Framework Core (`dotnet-ef`):
  ```bash
  dotnet tool install --global dotnet-ef
  ```
* [Bruno](https://www.usebruno.com/) (para execução da collection de testes automatizados/manuais)

---

## Estrutura do Projeto

O código-fonte está organizado por responsabilidades utilizando *namespaces* dedicados:

```text
ApiFutebol/
├── Data/
│   └── ApiDbContext.cs            # Contexto do Entity Framework Core e mapeamento do DbSet<ClubeEntity>
├── Dtos/
│   ├── ClubeDto.cs                # Record de entrada (DTO) utilizado na criação de clubes (POST)
│   └── ClubeAtualizadoDto.cs      # Record de entrada (DTO) utilizado na atualização de clubes (PUT)
├── Models/
│   └── ClubeEntity.cs             # Entidade de domínio que representa a tabela Clubes no banco de dados
├── Migrations/                    # Histórico versionado das migrações do Entity Framework Core
├── bruno/
│   ├── environments/
│   │   └── Local.yml              # Ambiente local configurado com baseUrl = http://localhost:5050
│   └── *.yml                      # Requisições da collection cobrindo todo o CRUD e validações de status HTTP
├── wwwroot/
│   ├── index.html                 # Página principal da interface web integrada
│   ├── style.css                  # Estilização da interface
│   └── app.js                     # Lógica frontend de consumo da API via Fetch API
├── Properties/
│   └── launchSettings.json        # Perfis de execução local da aplicação
├── Program.cs                     # Ponto de entrada: configuração de serviços, middleware de exceções e rotas da API
├── ApiFutebol.csproj              # Arquivo de projeto .NET 10 e dependências (EF Core / SQLite)
├── appsettings.json               # Configurações da aplicação e string de conexão com o banco SQLite
└── README.md                      # Documentação técnica do projeto
```

---

## Preparação do Banco de Dados

Este projeto utiliza **Migrations do Entity Framework Core** (armazenadas na pasta `Migrations/`) para criar e versionar o esquema do banco de dados — não utiliza criação automática via `EnsureCreated()`.

Antes de iniciar a aplicação pela primeira vez, execute na raiz do projeto para gerar o arquivo local `api-futebol.db`:

```bash
dotnet ef database update
```

---

## Como Executar

1. Na raiz do repositório, compile o projeto para garantir que não há erros:
   ```bash
   dotnet build
   ```

2. Inicie a aplicação na porta `5050`:
   ```bash
   dotnet run --urls http://localhost:5050
   ```

3. Verifique se a API está ativa acessando `http://localhost:5050/` (resposta esperada: `API do Futebol Brasileiro está no ar!`).

### Interface Web (Frontend)

Com a API em execução, acesse no navegador:
* `http://localhost:5050/index.html`

---

## Collection de Testes (Bruno)

A collection completa de testes está salva na pasta **`/bruno`** deste repositório.

1. Abra o **Bruno** e clique em **Open Collection**, selecionando a pasta `bruno/` na raiz do projeto.
2. No canto superior direito do Bruno, selecione o ambiente **`Local`** (definido em `bruno/environments/Local.yml`, que aponta `baseUrl` para `http://localhost:5050`).
3. Execute as requisições em sequência para validar listagem (`200`), cadastro (`201`), consulta por ID (`200`), atualização (`200`), remoção (`204`) e consulta de registro removido (`404`).

---

## Endpoints da API

| Método | Rota | Descrição | Status Esperado |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Verifica se a API está no ar | `200 OK` |
| `GET` | `/api/clubes` | Lista todos os clubes cadastrados | `200 OK` |
| `GET` | `/api/clubes/{id}` | Busca um clube específico pelo ID | `200 OK` ou `404 Not Found` |
| `POST` | `/api/clubes` | Cadastra um novo clube | `201 Created` |
| `PUT` | `/api/clubes/{id}` | Atualiza os dados de um clube existente | `200 OK` ou `404 Not Found` |
| `DELETE` | `/api/clubes/{id}` | Remove um clube pelo ID | `204 No Content` ou `404 Not Found` |

### Exemplos de Requisições e Corpos JSON

**Cadastrar clube (`POST /api/clubes`):**
```json
{
  "nome": "Internacional",
  "estado": "RS",
  "serieA": true
}
```

**Atualizar clube (`PUT /api/clubes/{id}`):**
```json
{
  "nome": "Sport Club Internacional",
  "estado": "RS",
  "serieA": true
}
```

---

## Observações Técnicas

* **Persistência:** Os dados são gravados no banco SQLite local (`api-futebol.db`) e permanecem disponíveis após encerrar e reiniciar a API.
* **Tratamento de Exceções:** O `Program.cs` conta com o middleware `app.UseExceptionHandler` configurado no início do pipeline para capturar falhas inesperadas e retornar status HTTP `500` com mensagem genérica em JSON, sem expor detalhes internos.
* **Versionamento:** Arquivos compilados (`bin/`, `obj/`) e o banco de testes local (`*.db`) são ignorados pelo `.gitignore`.

---

## Vídeo de demonstração — AS

* [Clique aqui para assistir ao vídeo da AS](https://drive.google.com/file/d/1zditAkiTbzAG7nMetTXcAWRX_t1jOIVD/view?usp=sharing)

---

### Histórico de Entregas Anteriores

* [Vídeo de demonstração — AP2](https://drive.google.com/file/d/1SB6ri077hcEoqOOso3uwZXXJVajZf7pM/view?usp=drive_link)
* [Vídeo de demonstração — AP1](https://drive.google.com/file/d/1Y7Q1FddKsqxdmB6q8JCpimrgIahJCzzA/view?usp=sharing)