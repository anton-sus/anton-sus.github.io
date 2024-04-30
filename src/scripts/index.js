let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");

let cityTitle = document.getElementById("city-title");
let cityInfo = document.getElementById("city-info");

let temperature = document.getElementById("conditions-temp");
let windSpeed = document.getElementById("conditions-wind-speed");

let currentDateElement = document.getElementById("current-date");
let temperatureChartInstance = null;

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

let latitude;
let longitude;
let jsonWheatherData;

function getDataForCity(cityName) {
  fetchCityData(cityName)
    .then((cityData) => {
      console.log(cityData.lat, cityData.lon);
      let cityDescription = `${cityData.state} (${cityData.country}): ${cityData.lat}°N, ${cityData.lon}°E`;
      latitude = cityData.lat;
      longitude = cityData.lon;

      // передаём в разметку
      cityTitle.innerHTML = cityData.name;
      cityInfo.innerHTML = cityDescription;

      searchInput.style.display = "none";
      return fetchWeatherData(cityData.lat, cityData.lon);
      // return fetchWeatherData(cityData.lat, cityData.lon);
    })
    .then((wData) => {
      // console.log(wData.main.temp);
      // console.log(wData);

      // передаём в разметку
      temperature.innerHTML = Math.round(wData.main.temp) + "°";
      windSpeed.innerHTML = Math.round(wData.wind.speed);

      // Сохранение cityName в localStorage
      // TODO: restore cityName
      localStorage.setItem("searches", JSON.stringify(cityName));

      return fetchForecastData(latitude, longitude);
    })
    .then((forecastData) => {
      console.log(forecastData);
      setDate();

      if (temperatureChartInstance) {
        temperatureChartInstance.destroy();
      }

      let ctx = document.getElementById("temperatureChart");

      let temperatureData = getTemperature(forecastData);

      // график
      temperatureChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: temperatureData.timeLabels,
          datasets: [
            {
              label: "Temperature (°C)",
              data: temperatureData.temperatures,
              borderColor: "rgb(24, 90, 161)",
              borderWidth: 2,
              pointRadius: 0,
              lineTension: .25,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
            },
          },
        },
      });
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
}

function getTemperature(jsonData) {
  const weatherList = jsonData.list;
  const timeLabels = [];
  const temperatures = [];

  weatherList.forEach((weather) => {
    const time = new Date(weather.dt_txt);
    const temperature = weather.main.temp;

    timeLabels.push(time.toLocaleTimeString());
    temperatures.push(temperature);
  });

  return { timeLabels, temperatures };
}

function setDate() {
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  currentDateElement.textContent = formattedDate;
}
