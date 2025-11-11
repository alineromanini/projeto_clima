/**
 * Script principal do aplicativo de previsão do tempo.
 * 
 * @file Este script inicializa os eventos de interface, busca informações
 * meteorológicas da API Open-Meteo e atualiza o DOM conforme o resultado.
 * 
 * @author Aline
 * @version 1.0
 */

document.addEventListener("DOMContentLoaded", () => {
  const botaoBuscar = document.getElementById("buscar");
  const botaoVoltar = document.getElementById("voltar");
  const cidadeInput = document.getElementById("cidade");
  const erro = document.getElementById("erro");
  const buscaContainer = document.getElementById("busca-container");
  const resultadoContainer = document.getElementById("resultado-container");
  const tempEl = document.getElementById("temperatura");
  const iconeEl = document.getElementById("icone-clima");
  const localEl = document.getElementById("localizacao");
  const descEl = document.getElementById("descricao");
  const dataEl = document.getElementById("data");

  const condicoes = {
    0: { icone: "wi-day-sunny", texto: "Céu limpo" },
    1: { icone: "wi-day-sunny-overcast", texto: "Parcialmente nublado" },
    2: { icone: "wi-cloud", texto: "Nublado" },
    3: { icone: "wi-cloudy", texto: "Encoberto" },
    45: { icone: "wi-fog", texto: "Neblina" },
    48: { icone: "wi-fog", texto: "Neblina densa" },
    51: { icone: "wi-sprinkle", texto: "Garoa" },
    61: { icone: "wi-rain", texto: "Chuva" },
    71: { icone: "wi-snow", texto: "Neve" },
    95: { icone: "wi-thunderstorm", texto: "Tempestade" },
  };

  /**
   * Realiza uma requisição HTTP e retorna o resultado em formato JSON.
   *
   * @async
   * @function fetchJson
   * @param {string} url - URL completa da requisição.
   * @param {string} errorMsg - Mensagem de erro personalizada em caso de falha.
   * @returns {Promise<Object>} Objeto JavaScript convertido do JSON retornado pela API.
   * @throws {Error} Se a resposta não for bem-sucedida (response.ok === false).
   *
   * @example
   * const dados = await fetchJson('https://api.exemplo.com/dados', 'Erro ao buscar dados');
   */

  async function fetchJson(url, errorMsg) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(errorMsg);
    return response.json();
  }

  /**
   * Exibe uma mensagem de erro na interface.
   *
   * @function mostrarErro
   * @param {string} msg - Mensagem a ser exibida ao usuário.
   * @returns {void}
   *
   * @example
   * mostrarErro("Cidade não encontrada.");
   */
  function mostrarErro(msg) {
    if (erro) erro.textContent = msg;
  }

  /**
   * Alterna a tela de busca para a tela de resultado.
   *
   * @function mostrarResultado
   * @returns {void}
   *
   * @example
   * mostrarResultado();
   */
  function mostrarResultado() {
    buscaContainer.style.display = "none";
    resultadoContainer.style.display = "block";
  }
  /**
     * Retorna à tela de busca, escondendo o resultado.
     *
     * @function mostrarBusca
     * @returns {void}
     *
     * @example
     * mostrarBusca();
     */
  function mostrarBusca() {
    resultadoContainer.style.display = "none";
    buscaContainer.style.display = "block";
  }

  /**
   * Busca e exibe as informações meteorológicas de uma cidade informada pelo usuário.
   *
   * @async
   * @function buscarClima
   *
   * @description
   * Esta função é acionada quando o usuário clica no botão "Buscar".
   * Ela lê o nome da cidade digitada, faz duas requisições à API Open-Meteo:
   * - `/search`: para obter latitude e longitude da cidade;
   * - `/forecast`: para buscar os dados do clima atual.
   *
   * Em seguida, atualiza a interface com temperatura, ícone do clima,
   * descrição textual, localização e data formatada.
   *
   * Caso ocorram erros (como cidade inexistente ou falha de rede),
   * a função exibe uma mensagem apropriada no elemento de erro.
   *
   * @param {Event} [event] - Evento de clique disparado pelo botão (opcional).
   * @returns {Promise<void>} Não retorna valor. Atualiza elementos do DOM.
   *
   * @throws {Error} Lança exceções nas seguintes situações:
   * - Falha ao buscar a localização (erro na API de geocodificação);
   * - Cidade não encontrada (resultado vazio);
   * - Falha ao buscar os dados meteorológicos;
   * - Ausência de `current_weather` na resposta da API.
   *
   * @example
   * // Exemplo: evento de clique no botão "Buscar"
   * botaoBuscar.addEventListener("click", buscarClima);
   *
   * // Ou chamada direta
   * await buscarClima();
   */
  async function buscarClima() {
    mostrarErro(""); // limpa erros

    const cidade = cidadeInput?.value.trim();
    if (!cidade) {
      mostrarErro("Por favor, digite o nome de uma cidade.");
      return;
    }

    try {
      // Buscar coordenadas
      const geoData = await fetchJson(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cidade
        )}&count=1&language=pt&format=json`,
        "Erro ao buscar localização"
      );

      if (!geoData.results?.length) {
        mostrarErro("Cidade não encontrada.");
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Buscar clima
      const climaData = await fetchJson(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        "Erro ao buscar dados do clima"
      );

      const { temperature, weathercode } = climaData.current_weather || {};
      const { icone, texto } =
        condicoes[weathercode] || { icone: "wi-na", texto: "Desconhecido" };

      // Atualizar interface
      tempEl.textContent = `${temperature ?? "--"}°C`;
      iconeEl.className = `wi ${icone}`;
      localEl.textContent = `${name}, ${country}`;
      descEl.textContent = texto;

      // Data formatada
      const dataAtual = new Date();
      dataEl.textContent = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(dataAtual);

      // Fundo conforme horário
      const hora = dataAtual.getHours();
      document.body.style.backgroundColor =
        hora >= 6 && hora < 18 ? "#87CEFA" : "#001F3F";

      mostrarResultado();
    } catch (e) {
      mostrarErro("Erro ao buscar dados. Verifique sua conexão.");
      console.error("Erro detalhado:", e);
    }
  } // ✅ FECHA a função buscarClima()

  // Eventos
  botaoBuscar?.addEventListener("click", buscarClima);
  botaoVoltar?.addEventListener("click", mostrarBusca);
}); // ✅ FECHA o DOMContentLoaded
