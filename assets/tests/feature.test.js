// assets/tests/feature.test.js
import { jest } from "@jest/globals";
import { buscarClima } from "../js/api-core.js";

// Criar o mock ESM corretamente
jest.unstable_mockModule("../js/api-core.js", () => ({
  buscarClima: jest.fn()
}));

const api = await import("../js/api-core.js");

describe("Testes das variáveis meteorológicas adicionais", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="precipitacao"><strong></strong></div>
      <div id="vento"><strong></strong></div>
      <div id="temp-min"><strong></strong></div>
      <div id="temp-max"><strong></strong></div>
    `;
    jest.clearAllMocks();
  });

  it("preenche corretamente precipitação, vento, temperatura mínima e máxima", async () => {
    const mockReturn = {
      precipitation: 5,
      windspeed: 12,
      tempMin: 15,
      tempMax: 28
    };

    api.buscarClima.mockResolvedValueOnce(mockReturn);

    const dados = await api.buscarClima("São Paulo");

    document.querySelector("#precipitacao strong").textContent = `${dados.precipitation} mm`;
    document.querySelector("#vento strong").textContent = `${dados.windspeed} km/h`;
    document.querySelector("#temp-min strong").textContent = `${dados.tempMin}°C`;
    document.querySelector("#temp-max strong").textContent = `${dados.tempMax}°C`;

    expect(document.querySelector("#precipitacao strong").textContent).toBe("5 mm");
    expect(document.querySelector("#vento strong").textContent).toBe("12 km/h");
    expect(document.querySelector("#temp-min strong").textContent).toBe("15°C");
    expect(document.querySelector("#temp-max strong").textContent).toBe("28°C");
  });
});
