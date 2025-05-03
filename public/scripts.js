async function sendCityToServer() {
    const cityName = document.getElementById('city').value;
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: cityName })
    });
  
    const data = await response.json();
    document.getElementById('weatherAiResult').textContent = data.aiComment;
    console.log("Sunucudan gelen:", data);
  }

document.getElementById('getWeatherBtn').addEventListener('click', function(event) {
    event.preventDefault();
    sendCityToServer();
});
