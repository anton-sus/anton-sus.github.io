let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");

let cityTitle = document.getElementById("city-title");
let cityInfo = document.getElementById("city-info");

let temperature = document.getElementById("conditions-temp");
let windSpeed = document.getElementById("conditions-wind-speed");

// TODO: restore from storage
const defaultCity = "London";
getDataForCity(defaultCity);


document.addEventListener("DOMContentLoaded", function () {
  searchInput.style.display = "none";
  // показ-скрытие поля searchInput
  searchButton.addEventListener("click", function () {
    if (searchInput.style.display === "none") {
      searchInput.style.display = "block";

      // очисить поле
      searchInput.value = null;
      searchInput.focus();
    } else {
      searchInput.style.display = "none";
    }
  });

  // скрытие по клику вне поля ввода и кнопки Search
  document.addEventListener("click", function (event) {
    if (
      !searchInput.contains(event.target) &&
      event.target.id !== "search-button"
    ) {
      searchInput.style.display = "none";
    }
  });

  // обработка события для получение значения из searchInput, поиск координат, запрос weatherData
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      cityName = searchInput.value;
      console.log(cityName);

      getDataForCity(cityName);
    }
  });
});

function getDataForCity(cityName) {
  fetchCityData(cityName)
    .then((cityData) => {
      console.log(cityData.lat, cityData.lon);
      let cityDescription = `${cityData.state} (${cityData.country}): ${cityData.lat}°N, ${cityData.lon}°E`;

      // передаём в разметку
      cityTitle.innerHTML = cityData.name;
      cityInfo.innerHTML = cityDescription;

      searchInput.style.display = "none";
      return fetchWeatherData(cityData.lat, cityData.lon);
      // return fetchWeatherData(cityData.lat, cityData.lon);
    })
    .then((wData) => {
      console.log(wData.main.temp);
      console.log(wData);

      // передаём в разметку
      temperature.innerHTML = Math.round(wData.main.temp) + "°";
      windSpeed.innerHTML = Math.round(wData.wind.speed);

      // Сохранение cityName в localStorage
      // TODO: restore cityName
      localStorage.setItem("searches", JSON.stringify(cityName));
    })
    .catch((error) => {
    console.error("Ошибка fetchCityData:", error);
    cityTitle.innerHTML = "City";
    cityInfo.innerHTML = "District (Country): coordinates";
  });
}
