# Evidência e Reflexão — Aula 14: Erros, Exceções e Middleware

### 1. Onde o middleware foi colocado no Program.cs

O middleware `app.UseExceptionHandler(...)` foi registrado logo após a inicialização da aplicação com `var app = builder.Build();`, posicionado antes de `UseCors`, `UseStaticFiles` e dos mapeamentos de rotas (`app.MapGet`, `app.MapPost`, etc.). Essa posição no início do pipeline HTTP é obrigatória para que o middleware consiga capturar qualquer exceção não tratada disparada durante a execução das rotas da API.

### 2. Resultado observado no teste temporário

- **Método:** `GET`
- **Rota:** `/api/teste-erro`
- **Status HTTP:** `500 Internal Server Error`
- **Corpo recebido:**
  ```json
  {
    "mensagem": "Ocorreu um erro interno. Tente novamente mais tarde."
  }
  ```

### 3. Resultado observado no teste de ID inexistente

- **Método:** `GET`
- **Rota:** `/api/clubes/999`
- **Status HTTP:** `404 Not Found`
- **Comportamento:** A API continuou retornando o status 404 esperado para regras de negócio (registro não encontrado), demonstrando que o middleware centralizado captura apenas falhas críticas inesperadas e preserva as respostas HTTP normais da aplicação.

### 4. Por que não devemos enviar a mensagem bruta da exceção ao cliente?

Não devemos enviar a mensagem bruta da exceção por razões de **segurança** e **usabilidade**. Expor detalhes técnicos como rastros de pilha (_stack traces_), estruturas de banco de dados, nomes de colunas ou caminhos de arquivos do servidor facilita ataques de agentes maliciosos que exploram essas vulnerabilidades (_information disclosure_). Além disso, para o usuário final, detalhes internos geram confusão em vez de clareza; o cliente deve receber apenas uma mensagem amigável, enquanto a falha detalhada é registrada em logs internos protegidos para análise da equipe técnica.