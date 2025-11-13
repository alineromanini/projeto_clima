// api.js

async function safeFetchJson(url, opts = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(id);

    if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
    const data = await res.json();
    if (!data || typeof data !== "object") throw new Error("Resposta inválida");
    return data;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function buscarClima(cidade) {
  const erro = document.getElementById("erro");
  const tempEl = document.getElementById("temperatura");
  const iconeEl = document.getElementById("icone-clima");
  const localEl = document.getElementById("localizacao");
  const descEl = document.getElementById("descricao");
  const dataEl = document.getElementById("data");
  const tempMaxEl = document.getElementById("temp-max");
  const tempMinEl = document.getElementById("temp-min");
  const ventoEl = document.getElementById("vento");
  const precipitacaoEl = document.getElementById("precipitacao");

  const buscaContainer = document.getElementById("busca-container");
  const resultadoContainer = document.getElementById("resultado-container");

  // Mapeamento de condições meteorológicas
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

  async function fetchJson(url, errorMsg) {
    const response = await safeFetchJson(url);
    if (!response.ok) throw new Error(errorMsg);
    return response.json();
  }

  function mostrarErro(msg) {
    if (erro) erro.textContent = msg;
  }

  function mostrarResultado() {
    buscaContainer.style.display = "none";
    resultadoContainer.style.display = "block";
  }

  function mostrarBusca() {
    resultadoContainer.style.display = "none";
    buscaContainer.style.display = "flex";
  }

  try {
    mostrarErro("");

    if (!cidade) {
      mostrarErro("Por favor, digite o nome de uma cidade.");
      return;
    }

    // 1️⃣ Buscar coordenadas
    const geoData = await safeFetchJson(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`,
      "Erro ao buscar localização"
    );

    if (!geoData.results?.length) {
      mostrarErro("Cidade não encontrada.");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2️⃣ Buscar clima atual e diário
    const weatherData = await safeFetchJson(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
      "Erro ao buscar dados do clima"
    );

    const { temperature, weathercode, windspeed } = weatherData.current_weather || {};
    const tempMax = weatherData.daily?.temperature_2m_max?.[0];
    const tempMin = weatherData.daily?.temperature_2m_min?.[0];
    const precipitation = weatherData.daily?.precipitation_sum?.[0];
    const { icone, texto } = condicoes[weathercode] || { icone: "wi-na", texto: "Desconhecido" };

    // 3️⃣ Atualizar interface
    tempEl.textContent = `${temperature ?? "--"}°C`;
    iconeEl.className = `wi ${icone}`;
    localEl.textContent = `${name}, ${country}`;
    descEl.textContent = texto;

    if (tempMaxEl) tempMaxEl.textContent = ` ${tempMax ?? "--"}°C`;
    if (tempMinEl) tempMinEl.textContent = `${tempMin ?? "--"}°C`;
    if (ventoEl) ventoEl.textContent = `${windspeed ?? "--"} km/h`;
    if (precipitacaoEl) precipitacaoEl.textContent = ` ${precipitation ?? "--"} mm`;

    const dataAtual = new Date();
    dataEl.textContent = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(dataAtual);

    // 4️⃣ Mudar cor do fundo (dia/noite)
    const hora = dataAtual.getHours();
    document.body.style.backgroundColor = hora >= 6 && hora < 18 ? "#e7eebeff" : "#0b3157ff";

    mostrarResultado();

    // Retorna para testes
    return {
      temperature,
      weathercode,
      windspeed,
      tempMax,
      tempMin,
      precipitation,
      name,
      country,
    };
  } catch (e) {
    mostrarErro("Erro ao buscar dados. Verifique sua conexão.");
    console.error("Erro detalhado:", e);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const botaoBuscar = document.getElementById("buscar");
  const botaoVoltar = document.getElementById("voltar");
  const cidadeInput = document.getElementById("cidade");

  botaoBuscar?.addEventListener("click", async () => {
    const cidade = cidadeInput?.value.trim();
    await buscarClima(cidade);
  });

  botaoVoltar?.addEventListener("click", () => {
    document.getElementById("resultado-container").style.display = "none";
    document.getElementById("busca-container").style.display = "flex";
  });

  async function fetchWithTimeout(url, opts = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await safeFetchJson(url, { ...opts, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

});
