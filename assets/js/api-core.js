async function buscarClima(cidade) {
  if (!cidade) {
    throw new Error("Por favor, digite o nome de uma cidade.");
  }

  const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`
  );

  if (!geoResponse.ok) throw new Error("Erro ao buscar localização");
  const geoData = await geoResponse.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Cidade não encontrada.");
  }

  const { latitude, longitude } = geoData.results[0];

  const climaResponse = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );

  if (!climaResponse.ok) throw new Error("Erro ao buscar dados do clima");

  const climaData = await climaResponse.json();
  if (!climaData.current_weather) throw new Error("Dados climáticos inválidos");

  return climaData.current_weather;
}

export { buscarClima };

