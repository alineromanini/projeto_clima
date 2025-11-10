document.getElementById('buscar').addEventListener('click', buscarClima();

async function buscarClima() {
    const cidade = document.getElementById('cidade').value.trim(); // trim pra remover espaços em branco no começo/fim
    const resultado = document.getElementById('resultado');

    if (!cidade) {
        resultado.textContent = 'Por favor, digite o nome de uma cidade';
        return;
    }

    try {
        //Busca lagitude e longitude da cidade
        const geoUrl =`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;
        const geoResp = await fetch(geoUrl);
        const geoData = await geoResp.json();

        if (!geoData.results || geoData.results.length === 0) {
            resultado.textContent = 'Cidade não encontrada. Tente novamente';
            return;
        }
        const { latitude, longitude, name, country } = geoData.results[0];

        //Busca temperatura atual
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current_weather=true`;
        const weatherResp = await fetch(weatherUrl);
        const weatherData = await weatherResp.json();

        const temperatura = weatherData.current_weather.temperature;

        resultado.textContent = `A temperatura atual em ${name}, ${country} é de ${temperatura}°C`;
    } catch (error) {
        resultado.textContent = 'Erro ao buscar os dados do clima. Tente novamente.';
        console.error(error);
    }
}

