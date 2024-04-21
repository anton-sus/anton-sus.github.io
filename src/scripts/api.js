const apiKey = "36783e67c693e40318a73ec3be962cfb";
const limit = 3; // количество найденных городов

// координаты города
function fetchCityData(cityName) {
  let getCoordsUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;
  return fetch(getCoordsUrl)
    .then((response) => response.json())
    .then((cityData) => {
      if (cityData.length > 0) {
        // возвращаем lat и lon первого элемента
        console.log(cityData);
        return {
          lat: cityData[0].lat,
          lon: cityData[0].lon,
          foundCityName: cityData[0].name,
          state: cityData[0].state,
          country: cityData[0].country
        };
      } else {
        throw new Error("Не найдено местоположение для указанного города");
      }
    })
    .catch((error) => console.error("Ошибка:", error));
}

// данные погоды по координатам
function fetchWeatherData(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      return json;
    });
}
