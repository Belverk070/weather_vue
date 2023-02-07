import axios from "axios";

export const getWeather = function ({ location, apiKey }) {
  return axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`
  );
};
