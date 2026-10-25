/**
 * ==========================================================================
 * Futebol Clube Manager - Interface Integrada à API REST
 * 
 * Comunicação direta com a API ASP.NET Core de Futebol Brasileiro.
 * Endpoints validados na collection Bruno:
 * - GET    /api/clubes      -> Lista todos os clubes
 * - GET    /api/clubes/{id} -> Busca clube por ID
 * - POST   /api/clubes      -> Cadastra novo clube
 * - PUT    /api/clubes/{id} -> Atualiza clube existente
 * - DELETE /api/clubes/{id} -> Remove clube por ID
 * ==========================================================================
 */

// Resolução da URL base da API
function obterApiUrl() {
  if (window.location.protocol.startsWith("http") && (window.location.port === "5050" || window.location.port === "5220")) {
    return "/api/clubes";
  }
  return "http://localhost:5050/api/clubes";
}

const API_URL = obterApiUrl();

// Estado da aplicação
let timeoutMensagem = null;
let estaCarregando = false;
let estaGravando = false;

// Elementos do DOM
const formClube = document.getElementById("form-clube");
const inputId = document.getElementById("clube-id");
const inputNome = document.getElementById("clube-nome");
const selectEstado = document.getElementById("clube-estado");
const checkboxSerieA = document.getElementById("clube-serie-a");
const btnSubmeter = document.getElementById("btn-submeter");
const btnCancelar = document.getElementById("btn-cancelar");
const btnRecarregar = document.getElementById("btn-recarregar");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");

const indicadorModo = document.getElementById("indicador-modo");
const tabelaCorpo = document.getElementById("tabela-clubes-corpo");
const tabelaVazia = document.getElementById("tabela-vazia");
const estadoCarregando = document.getElementById("estado-carregando");
const estadoErro = document.getElementById("estado-erro");
const textoErro = document.getElementById("texto-erro");
const contadorClubes = document.getElementById("contador-clubes");

const containerMensagem = document.getElementById("mensagem-status");
const textoMensagem = document.getElementById("mensagem-texto");
const btnFecharMensagem = document.getElementById("btn-fechar-mensagem");

/**
 * Exibe uma mensagem de status/feedback para o usuário
 * @param {string} texto Mensagem descritiva
 * @param {'sucesso' | 'erro' | 'info'} tipo Estilo visual da notificação
 */
function exibirMensagem(texto, tipo = "sucesso") {
  if (timeoutMensagem) {
    clearTimeout(timeoutMensagem);
  }

  containerMensagem.className = "alert-box";
  if (tipo === "sucesso") {
    containerMensagem.classList.add("alert-success");
  } else if (tipo === "erro") {
    containerMensagem.classList.add("alert-error");
  } else {
    containerMensagem.classList.add("alert-info");
  }

  // Atribuição segura com textContent
  textoMensagem.textContent = texto;
  containerMensagem.hidden = false;

  timeoutMensagem = setTimeout(() => {
    fecharMensagem();
  }, 6000);
}

/**
 * Fecha a caixa de mensagem
 */
function fecharMensagem() {
  containerMensagem.hidden = true;
  if (timeoutMensagem) {
    clearTimeout(timeoutMensagem);
    timeoutMensagem = null;
  }
}

/**
 * Controla os elementos visuais de carregamento
 * @param {boolean} carregando 
 */
function definirEstadoCarregamento(carregando) {
  estaCarregando = carregando;
  estadoCarregando.hidden = !carregando;
  btnRecarregar.disabled = carregando;

  if (carregando) {
    estadoErro.hidden = true;
    tabelaVazia.hidden = true;
  }
}

/**
 * Controla o estado de envio/gravação do formulário
 * @param {boolean} gravando 
 */
function definirEstadoGravacao(gravando) {
  estaGravando = gravando;
  btnSubmeter.disabled = gravando;
  inputNome.disabled = gravando;
  selectEstado.disabled = gravando;
  checkboxSerieA.disabled = gravando;

  if (gravando) {
    btnSubmeter.textContent = "Processando...";
  } else {
    const editando = Boolean(inputId.value);
    btnSubmeter.textContent = editando ? "Atualizar Clube" : "Salvar Clube";
  }
}

/**
 * Reseta o formulário para o estado inicial de novo cadastro
 */
function resetarFormulario() {
  formClube.reset();
  inputId.value = "";
  indicadorModo.textContent = "Novo Cadastro";
  indicadorModo.className = "badge badge-novo";
  btnSubmeter.textContent = "Salvar Clube";
}

/**
 * Renderiza a lista de clubes retornada pela API
 * Insere todos os valores estritamente via textContent
 * @param {Array<Object>} clubes 
 */
function renderizarClubes(clubes) {
  tabelaCorpo.innerHTML = "";

  if (!Array.isArray(clubes) || clubes.length === 0) {
    tabelaVazia.hidden = false;
    contadorClubes.textContent = "0";
    return;
  }

  tabelaVazia.hidden = true;
  contadorClubes.textContent = String(clubes.length);

  clubes.forEach((clube) => {
    const tr = document.createElement("tr");

    // Coluna ID (textContent)
    const tdId = document.createElement("td");
    tdId.textContent = `#${clube.id}`;
    tdId.style.fontWeight = "600";

    // Coluna Nome (textContent)
    const tdNome = document.createElement("td");
    tdNome.textContent = String(clube.nome ?? "");

    // Coluna Estado (textContent)
    const tdEstado = document.createElement("td");
    tdEstado.textContent = String(clube.estado ?? "");

    // Coluna Série A (badge com textContent)
    const tdSerieA = document.createElement("td");
    const badgeDivisao = document.createElement("span");
    badgeDivisao.className = `badge ${clube.serieA ? "badge-serie-a" : "badge-outras"}`;
    badgeDivisao.textContent = clube.serieA ? "Série A" : "Outras Divisões";
    tdSerieA.appendChild(badgeDivisao);

    // Coluna Ações
    const tdAcoes = document.createElement("td");
    tdAcoes.className = "td-actions";

    const containerAcoes = document.createElement("div");
    containerAcoes.className = "action-buttons";

    // Botão Editar (busca registro na API)
    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn btn-sm btn-action-view";
    btnEditar.setAttribute("aria-label", `Editar clube ${clube.nome}`);
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => carregarClubeParaEdicao(clube.id));

    // Botão Excluir
    const btnExcluir = document.createElement("button");
    btnExcluir.type = "button";
    btnExcluir.className = "btn btn-sm btn-action-delete";
    btnExcluir.setAttribute("aria-label", `Excluir clube ${clube.nome}`);
    btnExcluir.textContent = "Excluir";
    btnExcluir.addEventListener("click", () => excluirClube(clube.id, clube.nome));

    containerAcoes.appendChild(btnEditar);
    containerAcoes.appendChild(btnExcluir);
    tdAcoes.appendChild(containerAcoes);

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdEstado);
    tr.appendChild(tdSerieA);
    tr.appendChild(tdAcoes);

    tabelaCorpo.appendChild(tr);
  });
}

/**
 * Busca todos os clubes na API (GET /api/clubes)
 */
async function carregarClubes() {
  definirEstadoCarregamento(true);

  try {
    const resposta = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao consultar API (Status ${resposta.status}: ${resposta.statusText})`);
    }

    const dados = await resposta.json();
    estadoErro.hidden = true;
    renderizarClubes(dados);
  } catch (erro) {
    tabelaCorpo.innerHTML = "";
    tabelaVazia.hidden = true;
    contadorClubes.textContent = "-";
    estadoErro.hidden = false;
    textoErro.textContent = `Falha na requisição: ${erro.message}. Verifique se a API está ativa em ${API_URL}.`;
    exibirMensagem(`Erro ao listar clubes: ${erro.message}`, "erro");
  } finally {
    definirEstadoCarregamento(false);
  }
}

/**
 * Busca os dados de um clube pelo ID na API e carrega no formulário (GET /api/clubes/{id})
 * @param {number} id 
 */
async function carregarClubeParaEdicao(id) {
  definirEstadoGravacao(true);

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!resposta.ok) {
      if (resposta.status === 404) {
        throw new Error(`Clube #${id} não foi encontrado na API (Status 404).`);
      }
      throw new Error(`Falha ao buscar clube #${id} (Status ${resposta.status}).`);
    }

    const clube = await resposta.json();

    inputId.value = String(clube.id);
    inputNome.value = clube.nome ?? "";
    selectEstado.value = clube.estado ?? "";
    checkboxSerieA.checked = Boolean(clube.serieA);

    indicadorModo.textContent = `Editando Clube #${clube.id}`;
    indicadorModo.className = "badge badge-edicao";
    btnSubmeter.textContent = "Atualizar Clube";

    inputNome.focus();
    exibirMensagem(`Clube "${clube.nome}" carregado para edição.`, "info");
  } catch (erro) {
    exibirMensagem(erro.message, "erro");
  } finally {
    definirEstadoGravacao(false);
  }
}

/**
 * Salva um clube via POST (criar) ou PUT (atualizar) e recarrega os dados da API
 * @param {Event} event 
 */
async function salvarClube(event) {
  event.preventDefault();

  const idExistente = inputId.value.trim();
  const nome = inputNome.value.trim();
  const estado = selectEstado.value.trim();
  const serieA = checkboxSerieA.checked;

  if (!nome) {
    exibirMensagem("Por favor, preencha o nome do clube.", "erro");
    inputNome.focus();
    return;
  }

  if (!estado) {
    exibirMensagem("Por favor, selecione o estado (UF) do clube.", "erro");
    selectEstado.focus();
    return;
  }

  // Payload exatamente no formato esperado pelo backend
  const payload = {
    nome: nome,
    estado: estado,
    serieA: serieA
  };

  definirEstadoGravacao(true);

  try {
    if (idExistente) {
      // Atualização: PUT /api/clubes/{id}
      const idNum = parseInt(idExistente, 10);
      const resposta = await fetch(`${API_URL}/${idNum}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!resposta.ok) {
        if (resposta.status === 404) {
          throw new Error(`O clube #${idNum} não foi encontrado para atualização (Status 404).`);
        }
        throw new Error(`Erro ao atualizar clube (Status ${resposta.status}: ${resposta.statusText}).`);
      }

      exibirMensagem(`Clube "${nome}" atualizado com sucesso no banco de dados!`, "sucesso");
    } else {
      // Criação: POST /api/clubes
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!resposta.ok) {
        throw new Error(`Erro ao cadastrar clube (Status ${resposta.status}: ${resposta.statusText}).`);
      }

      const clubeCriado = await resposta.json().catch(() => null);
      const idMsg = clubeCriado && clubeCriado.id ? ` com ID #${clubeCriado.id}` : "";
      exibirMensagem(`Clube "${nome}" cadastrado com sucesso${idMsg}!`, "sucesso");
    }

    resetarFormulario();

    // Recarrega os dados imediatamente da API após a gravação
    await carregarClubes();
  } catch (erro) {
    exibirMensagem(erro.message, "erro");
  } finally {
    definirEstadoGravacao(false);
  }
}

/**
 * Remove um clube da API (DELETE /api/clubes/{id}) e recarrega os dados
 * @param {number} id 
 * @param {string} nome 
 */
async function excluirClube(id, nome) {
  const confirmacao = window.confirm(
    `Tem certeza que deseja excluir o clube "${nome}" (ID #${id}) da API?`
  );

  if (!confirmacao) return;

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!resposta.ok) {
      if (resposta.status === 404) {
        throw new Error(`O clube #${id} não foi encontrado na API (Status 404).`);
      }
      throw new Error(`Erro ao excluir clube (Status ${resposta.status}: ${resposta.statusText}).`);
    }

    // Se o formulário estava editando o clube removido, limpa o formulário
    if (inputId.value === String(id)) {
      resetarFormulario();
    }

    exibirMensagem(`Clube "${nome}" excluído com sucesso!`, "sucesso");

    // Recarrega os dados imediatamente da API após a exclusão
    await carregarClubes();
  } catch (erro) {
    exibirMensagem(erro.message, "erro");
  }
}

// Inicialização dos Ouvintes de Eventos
document.addEventListener("DOMContentLoaded", () => {
  formClube.addEventListener("submit", salvarClube);

  btnCancelar.addEventListener("click", () => {
    resetarFormulario();
    exibirMensagem("Formulário limpo.", "info");
  });

  btnRecarregar.addEventListener("click", () => {
    carregarClubes();
  });

  btnTentarNovamente.addEventListener("click", () => {
    carregarClubes();
  });

  btnFecharMensagem.addEventListener("click", fecharMensagem);

  // Carrega os dados reais da API ao abrir a página
  carregarClubes();
});
