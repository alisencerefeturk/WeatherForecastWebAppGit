const axios = require('axios');
require('dotenv').config();
const express = require('express');
const { accessSync } = require('fs');
const app = express();
const bcrypt = require('bcrypt');
const { error } = require('console');
const sql = require('mssql');

const PORT = 3000;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Sunucu başarıyla çalışıyor');
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});

app.post('/api/weather', async (req, res) => {
  const city = req.body.city;
  const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`;

  try {
    const response = await axios.get(geoURL);
    const geoData = response.data;
    const lat = geoData[0].lat;
    const lon = geoData[0].lon;

    const weatherURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    const weatherResponse = await axios.get(weatherURL);
    const weatherData = weatherResponse.data;

    const prompt = `City:${city}\nTemperature:${weatherData.current.temp}\nHumidity:${weatherData.current.humidity}\nWind speed:${weatherData.current.wind_speed}\nWeather:${weatherData.current.weather[0].main}\nDil tamamen türkçe olsun.`;

    const weatherIconCode = `${weatherData.current.weather[0].icon}`;
    const weatherIconURL = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;

    const headers = {
      'Content-Type': 'application/json'
    };

    const geminiBody = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/tunedModels/geminiweatherdataset4999tr-9uinx7zoq788:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const geminiResponse = await axios.post(geminiURL, geminiBody, { headers });
    const aiText = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Yorum alınamadı.';

    res.json({
      geo: geoData,
      weather: weatherData,
      aiComment: aiText,
      weatherIcon: weatherIconURL
    });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Hata alındı' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log('Formdan gelen kullanıcı adı: ', username);
  console.log('Formdan gelen şifre:', password);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('şifrelenmiş hali:', hashedPassword);

    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, hashedPassword)
      .query('INSERT INTO Users (username, password) VALUES (@username, @password)');

    res.send(`<h3>Kayıt başarılı! <a href="/login.html">Giriş yap</a></h3>`);
  } catch (err) {
    console.error('Hata', err);
    res.status(500).send('Bir hata oluştu.');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Users WHERE username = @username');

    const user = result.recordset[0];

    if (!user) {
      return res.send('Kullanıcı bulunamadı');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.send('Şifre hatalı');
    }
    res.send(`Giriş başarılı! Hoş geldin, ${user.username}`);

  } catch (err) {
    console.error('Girişte hata:', err);
    res.status(500).send('Bir hata oluştu.');
  }
});

app.post('/favorite', async (req, res) => {
  const { city } = req.body;
  const username = 'sencer'; // Not: Bu geçici. Gerçek uygulamada giriş yapmış kullanıcıdan alınmalı.

  try {
    const pool = await sql.connect(dbConfig);
    await pool
      .request()
      .input('username', sql.NVarChar, username)
      .input('city', sql.NVarChar, city)
      .query('UPDATE Users SET favoriteCity = @city WHERE username = @username');
      res.send('Favori şehir kaydedildi!');
  } catch (err) {
    console.error('Favori şehir kaydında hata:', err);
    res.status(500).send('Bir hata oluştu.');
  }
  
});
