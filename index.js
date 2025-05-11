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
    const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`
    try {
        const response = await axios.get(geoURL);
        const geoData = response.data;
        const lat = geoData[0].lat;
        const lon = geoData[0].lon;
        // console.log("Geo API'den gelen veri:", geoData); //Geo API verisi kontrolü için

        const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
        const weatherResponse = await axios.get(weatherURL);
        const weatherData = weatherResponse.data
        const prompt = `City:${city}
        Temperature:${weatherData.current.temp}
        Humidity:${weatherData.current.humidity}
        Wind speed:${weatherData.current.wind_speed}
        Weather:${weatherData.current.weather[0].main}
        Dil tamamen türkçe olsun.
        `
        const weatherIconCode = `${weatherData.current.weather[0].icon}`;
        const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
        // console.log(`Şehir bilgisi vs:${weatherData}`); // Tüm bilgileri ve apileri kontrol için

        const headers = {
            "Content-Type": "application/json",
        };
        
        const geminiBody = {
            contents: [
                {
                    parts: [
                        { text: prompt }
                    ]
                }
            ]
        };
        const geminiURL = `https://generativelanguage.googleapis.com/v1beta/tunedModels/geminiweatherdataset4999tr-9uinx7zoq788:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const geminiResponse = await axios.post(geminiURL, geminiBody, { headers });
        const aiText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Yorum alınamadı.";
        
        res.json({
            geo: geoData,
            weather: weatherData,
            aiComment: aiText,
            weatherIcon: weatherIconURL
          });
        // console.log(JSON.stringify(geminiResponse.data, null, 2));
          

    } catch(error) {
        console.error("Hata:", error);
        res.status(500).json({ error: "Hata alındı" });
    }
})