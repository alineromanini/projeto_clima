const { buscarClima } = require("../js/api-core.js");

global.fetch = jest.fn();

describe("Função buscarClima", () => {
  beforeEach(() => jest.clearAllMocks());

  test("1. Nome de cidade válido retorna dados meteorológicos", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ latitude: -23.55, longitude: -46.63 }] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ current_weather: { temperature: 25, weathercode: 1 } }),
      });

    const data = await buscarClima("São Paulo");
    expect(data).toEqual({ temperature: 25, weathercode: 1 });
  });

  test("2. Nome de cidade inexistente lança exceção tratada", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });
    await expect(buscarClima("CidadeInvalida")).rejects.toThrow("Cidade não encontrada.");
  });

  test("3. Entrada vazia retorna erro de validação", async () => {
    await expect(buscarClima("")).rejects.toThrow("Por favor, digite o nome de uma cidade.");
  });

  test("4. Falha da API gera resposta adequada (timeout ou erro)", async () => {
    fetch.mockResolvedValueOnce({ ok: false });
    await expect(buscarClima("São Paulo")).rejects.toThrow("Erro ao buscar localização");
  });
});
