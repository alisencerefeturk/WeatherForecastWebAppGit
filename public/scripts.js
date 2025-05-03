async function sendCityToServer() {
    const cityName = document.getElementById('city').value;
    const response = await fetch('/api/weather', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: cityName })
    });
  
    const data = await response.json();
    console.log("Sunucudan gelen:", data);
  }
  
// async function getCityData() {
//     const city = document.getElementById('city').value;
//     const API_KEY = "e1a75326499aef8d7f1e34c053329125";
//     const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
//     if (!city) {
//         console.error("Şehir ismi boş!");
//         document.getElementById("weatherResult").textContent = "Lütfen bir şehir girin!";
//         return;
//     }
//     fetch(url)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok (City Info)');
//             }
//             return response.json();
//         })
//         .then(data => {
//             const lat = data[0].lat;
//             const lon = data[0].lon;
//             console.log(lat, lon);
//             getWeatherData(lat, lon, API_KEY, city);
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             document.getElementById("weatherResult").textContent = "Hata! Veri alınamadı.";
//         });
// }
// async function getWeatherData(lat, lon, API_KEY, city) {
//     const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
//     fetch(url)
//         .then(response => {
//             if(!response.ok){
//                 throw new Error('Network response was not ok (Weather Info)');
//             }
//             return response.json();
//         })
//         .then(data => {
//             const name = city;
//             const temp = data.current.temp;
//             const humidity = data.current.humidity;
//             const wind = data.current.wind_speed;
//             const weather = data.current.weather[0].main;
//             console.log(name, temp, humidity, wind, weather)
//             // gemini(name, temp, humidity, wind, weather);
//             document.getElementById("weatherResult").innerHTML = `
//                 <h3>Weather in ${name}</h3>
//                 <p>Temperature: ${temp}°C</p>
//                 <p>Humidity: ${humidity}%</p>
//                 <p>Wind Speed: ${wind} m/s</p>
//                 <p>Weather: ${weather}</p>
//             `;
//         })
// }
document.getElementById('getWeatherBtn').addEventListener('click', function(event) {
    event.preventDefault();
    sendCityToServer();
});
