async function sendCityToServer() {
    const cityName = document.getElementById('city').value;
    const button = document.getElementById('getWeatherBtn');
    const buttonText = button.querySelector('.button-text');
    
    // Set loading state
    button.disabled = true;
    button.classList.add('loading');
    buttonText.textContent = 'Yükleniyor...';

    try {
        const response = await fetch('/api/weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city: cityName })
        });
    
        const data = await response.json();
        document.getElementById('weatherAiResult').textContent = data.aiComment;
        document.getElementById('weatherIcon').src = data.weatherIcon;
        console.log("Sunucudan gelen:", data);
        resultBoxIcoDiv.style.display = 'block';
    } catch (error) {
        console.error("Hata:", error);
        document.getElementById('weatherAiResult').textContent = "Bir hata oluştu. Lütfen tekrar deneyin.";
    } finally {
        // Reset button state
        button.disabled = false;
        button.classList.remove('loading');
        buttonText.textContent = 'Tahmin Al';
        addFavCitybutton.style.display = 'block';
    }
}

document.getElementById('getWeatherBtn').addEventListener('click', function(event) {
    event.preventDefault();
    sendCityToServer();
});


const resultBox = document.getElementById('weather-ai');
const resultBoxIcoDiv = document.getElementById('weather-icon-div');
const addFavCitybutton = document.getElementById('add-fav-button')

resultBox.classList.remove('visible');
resultBoxIcoDiv.classList.remove('visible');

setTimeout(() => {
  resultBox.classList.add('visible');
  resultBoxIcoDiv.classList.add('visible');
}, 10);

document.getElementById('weather-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const city = document.getElementById('city').value;

  const response = await fetch('/favorite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ city })
  });

  
const data = await response.text();
const msgBox = document.getElementById('add-fav-confirm');
msgBox.textContent = data;
msgBox.style.display = 'block';
setTimeout(() => {
  msgBox.style.display = 'none';
}, 3000);
});