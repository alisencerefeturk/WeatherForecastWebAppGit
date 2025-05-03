const axios = require('axios');
require('dotenv').config();
const express = require('express');
const { accessSync } = require('fs');
const app = express();

const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Sunucu başarıyla çalışıyor')
})

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
})

app.post('/api/weather', async(req, res) =>{
    const city = req.body.city;
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`
    try {
        const response = await axios.get(geoUrl);
        const geoData = response.data;
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        console.log("Geo API'den gelen veri:", geoData);

        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
        const weatherResponse = await axios.get(weatherUrl);
        const weatherData = weatherResponse.data
        console.log("Weather API'den gelen veri", weatherData);
        res.json({
            message: "Veriler alındı:", 
            geo: geoData,
            weather: weatherData
        }); 
 
    } catch(error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Hata alındı" });
    }

})