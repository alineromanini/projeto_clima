document.addEventListener("DOMContentLoaded", () => {
  const botaoBuscar = document.getElementById("buscar");
  const botaoVoltar = document.getElementById("voltar");
  const buscaContainer = document.getElementById("busca-container");
  const resultadoContainer = document.getElementById("resultado-container");
  const erro = document.getElementById("erro");

  botaoBuscar.addEventListener("click", buscarClima);
  botaoVoltar.addEventListener("click", () => {
    resultadoContainer.style.display = "none";
    buscaContainer.style.display = "block";
  });

  async function buscarClima() {
    const cidade = document.getElementById("cidade").value.trim();
    erro.textContent = "";

    if (!cidade) {
      erro.textContent = "Por favor, digite o nome de uma cidade.";
      return;
    }

    try {
      // 1️⃣ Buscar latitude e longitude da cidade
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cidade
        )}&count=1&language=pt&format=json`
      );

      if (!geoResponse.ok) throw new Error("Erro ao buscar localização");

      const geoData = await geoResponse.json();
      if (!geoData.results || geoData.results.length === 0) {
        erro.textContent = "Cidade não encontrada.";
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2️⃣ Buscar clima atual usando as coordenadas da cidade
      const climaResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      if (!climaResponse.ok) throw new Error("Erro ao buscar dados do clima");

      const climaData = await climaResponse.json();
      if (!climaData.current_weather) {
        throw new Error("A resposta da API não contém 'current_weather'");
      }

      const { temperature: temp, weathercode: codigo } =
        climaData.current_weather;

      // 3️⃣ Define o ícone e descrição com base no código do tempo
      const icones = {
        0: "wi-day-sunny",
        1: "wi-day-sunny-overcast",
        2: "wi-cloud",
        3: "wi-cloudy",
        45: "wi-fog",
        48: "wi-fog",
        51: "wi-sprinkle",
        61: "wi-rain",
        71: "wi-snow",
        95: "wi-thunderstorm",
      };

      const descricao = {
        0: "Céu limpo",
        1: "Parcialmente nublado",
        2: "Nublado",
        3: "Encoberto",
        45: "Neblina",
        48: "Neblina densa",
        51: "Garoa",
        61: "Chuva",
        71: "Neve",
        95: "Tempestade",
      };

      const icone = icones[codigo] || "wi-na";
      const textoClima = descricao[codigo] || "Desconhecido";

      // 4️⃣ Exibe dados na tela
      document.getElementById("temperatura").textContent = `${temp}°C`;
      document.getElementById("icone-clima").className = `wi ${icone}`;
      document.getElementById("localizacao").textContent = `${name}, ${country}`;
      document.getElementById("descricao").textContent = textoClima;

      // 5️⃣ Data formatada
      const dataAtual = new Date();
      const formatador = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      document.getElementById("data").textContent = formatador.format(dataAtual);

      // 6️⃣ Fundo de acordo com o horário
      const hora = dataAtual.getHours();
      document.body.style.backgroundColor =
        hora >= 6 && hora < 18 ? "#87CEFA" : "#001F3F";

      // 7️⃣ Troca de tela
      buscaContainer.style.display = "none";
      resultadoContainer.style.display = "block";
    } catch (e) {
      erro.textContent = "Erro ao buscar dados. Verifique sua conexão.";
      console.error("Erro detalhado:", e);
    }
  }
});
