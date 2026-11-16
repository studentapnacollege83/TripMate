

const weatherService = require("../services/weatherService");

exports.getWeather = async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.render("weather/index", {
        weather: null,
        forecast: null,
        error: null
      });
    }

    const [weather, forecast] = await Promise.all([
      weatherService.getWeather(city),
      weatherService.getForecast(city)
    ]);

    res.render("weather/index", {
      weather,
      forecast,
      error: null
    });
  } catch (error) {
    console.error("Weather error:", error.message);

    res.render("weather/index", {
      weather: null,
      forecast: null,
      error: "Weather information could not be found."
    });
  }
};