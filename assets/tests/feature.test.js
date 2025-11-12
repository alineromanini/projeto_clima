/**
 * @jest-environment jsdom
 */

import { buscarClima } from "../assets/js/api.js";

// Mock da função fetch global
global.fetch = jest.fn();

describe("Teste da função buscarClima", () => {
  beforeEach(() => {
    fetch.mockClear();
    document.body.innerHTML = `
      <div id="erro"></div>
      <div id="caixa-clima">
        <i id="icone-clima"></i>
        <span id="temperatura"></span>
      </div>
      <p id="localizacao"></p>
      <p id="descricao"></p>
      <p id="data"></p>
      <p id="temp-max"></p>
      <p id="temp-min"></p>
      <p id="vento"></p>
      <p id="precipitacao"></p>
    `;
  });

  test("1. Cidade válida retorna dados meteorológicos completos", async () => {
    // Mock da API de geocodificação
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          results: [{ latitude: -23.55, longitude: -46.63, name: "São Paulo", country: "Brasil" }],
        }),
      })
      // Mock da API de clima
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current_weather: {
            temperature: 25,
            weathercode: 1,
            windspeed: 10,
          },
          daily: {
            temperature_2m_max: [28],
            temperature_2m_min: [18],
            precipitation_sum: [2.5],
          },
        }),
      });

    const resultado = await buscarClima("São Paulo");

    expect(resultado).toEqual({
      temperature: 25,
      weathercode: 1,
      windspeed: 10,
      tempMax: 28,
      tempMin: 18,
      precipitation: 2.5,
      name: "São Paulo",
      country: "Brasil",
    });

    // Verifica se a interface foi atualizada corretamente
    expect(document.getElementById("temperatura").textContent).toContain("25");
    expect(document.getElementById("localizacao").textContent).toContain("São Paulo");
    expect(document.getElementById("vento").textContent).toContain("10");
    expect(document.getElementById("temp-max").textContent).toContain("28");
    expect(document.getElementById("temp-min").textContent).toContain("18");
    expect(document.getElementById("precipitacao").textContent).toContain("2.5");
  });

  test("2. Cidade inexistente exibe mensagem de erro", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });

    await buscarClima("CidadeFicticia123");
    expect(document.getElementById("erro").textContent).toBe("Cidade não encontrada.");
  });

  test("3. Erro na API lança exceção controlada", async () => {
    fetch.mockRejectedValueOnce(new Error("Falha na rede"));

    await buscarClima("São Paulo");
    expect(document.getElementById("erro").textContent).toBe("Erro ao buscar dados. Verifique sua conexão.");
  });
});
