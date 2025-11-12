import { buscarClima } from "../js/api-core.js";

// Supondo que fetch já esteja mockado
global.fetch = jest.fn();

test("Nome de cidade válido retorna dados meteorológicos", async () => {
  // Mock para São Paulo
  fetch
    .mockResolvedValueOnce({ // primeira chamada: coordenadas de São Paulo
      ok: true,
      json: async () => ({ results: [{ latitude: -23.55, longitude: -46.63 }] }),
    })
    .mockResolvedValueOnce({ // segunda chamada: clima de São Paulo
      ok: true,
      json: async () => ({ current_weather: { temperature: 25, weathercode: 1 } }),
    });

  let data = await buscarClima("São Paulo");
  expect(data).toEqual({ temperature: 25, weathercode: 1 });

  // Reset do mock para a próxima cidade
  fetch.mockReset();

  // Mock para Rio de Janeiro
  fetch
    .mockResolvedValueOnce({ // primeira chamada: coordenadas do Rio
      ok: true,
      json: async () => ({ results: [{ latitude: -22.91, longitude: -43.17 }] }),
    })
    .mockResolvedValueOnce({ // segunda chamada: clima do Rio
      ok: true,
      json: async () => ({ current_weather: { temperature: 28, weathercode: 2 } }),
    });

  data = await buscarClima("Rio de Janeiro");
  expect(data).toEqual({ temperature: 28, weathercode: 2 });
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
