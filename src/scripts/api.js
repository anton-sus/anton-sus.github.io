const apiKey = "36783e67c693e40318a73ec3be962cfb";
const limit = 1; // количество найденных городов

// координаты города
function fetchCityData(cityName) {
  let getCoordsUrl = `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;
  return fetch(getCoordsUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.length > 0) {
        // console.log(data);
        return {
          lat: data[0].lat,
          lon: data[0].lon,
          name: data[0].name,
          state: data[0].state,
          country: data[0].country
        };
      } else {
        throw new Error("Не найдено местоположение для указанного города");
      }
    })
    .catch((error) => console.error("Ошибка:", error));
}

// данные погоды по координатам
function fetchWeatherData(lat, lon) {
  const url = `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

// прогноз
function fetchForecastData(lat, lon) {
  const url = `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${apiKey}`;
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
}

