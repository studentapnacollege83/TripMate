const getWeather = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY is missing.");
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${encodeURIComponent(city)}` +
    `&appid=${apiKey}` +
    `&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch weather data.");
  }

  const data = await response.json();

  return data;
};
const getForecast = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY is missing.");
  }

  const url =
    `https://api.openweathermap.org/data/2.5/forecast` +
    `?q=${encodeURIComponent(city)}` +
    `&appid=${apiKey}` +
    `&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch forecast data.");
  }

  const data = await response.json();

  return data;
};
module.exports = {
  getWeather,getForecast
};