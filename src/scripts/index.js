let searchInput = document.getElementById("search-input");
let searchButton = document.getElementById("search-button");

let cityTitle = document.getElementById("city-title");
let cityInfo = document.getElementById("city-info");

let temperature = document.getElementById("conditions-temp");
let windSpeed = document.getElementById("conditions-wind-speed");

let currentDateElement = document.getElementById("current-date");

let temperatureChartInstance;
let latitude;
let longitude;
let jsonWheatherData;

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
      latitude = cityData.lat;
      longitude = cityData.lon;

      // передаём в разметку
      cityTitle.innerHTML = cityData.name;
      cityInfo.innerHTML = cityDescription;

      searchInput.style.display = "none";
      return fetchWeatherData(cityData.lat, cityData.lon);
    })
    .then((wData) => {
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
      setCurrentDate();

      if (temperatureChartInstance) {
        temperatureChartInstance.destroy();
      }

      let ctx = document.getElementById("temperatureChart");
      let dataForChart = getDataForChart(forecastData);
      createChart(dataForChart, ctx);
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
}

function createChart(dataForChart, ctx) {
  let temperatureDataset = {
    label: "Temperature (°C)",
    data: dataForChart.temperatures,
    borderColor: "rgb(186, 53, 46)",
    borderWidth: 2,
    pointRadius: 0,
    lineTension: 0.4,
    yAxisID: "temperature-axis",
    xAxisID: "time-axis",
  };

  let pressureDataset = {
    label: "Pressure (hPa)",
    data: dataForChart.pressures,
    borderColor: "rgb(100, 100, 100)",
    borderWidth: 2,
    pointRadius: 0,
    lineTension: 0.4,
    yAxisID: "pressure-axis",
  };

  let datasets = [temperatureDataset, pressureDataset];

  temperatureChartInstance = new Chart(ctx, {
    type: "line",
    plugins: [
      {
        afterLayout: (chart) => {
          let ctx = chart.ctx;
          ctx.save();
          let yAxis = chart.scales["temperature-axis"];
          let yThreshold = yAxis.getPixelForValue(0);
          let gradient = ctx.createLinearGradient(
            0,
            yAxis.top,
            0,
            yAxis.bottom
          );
          gradient.addColorStop(0, "red");
          let offset = (1 / yAxis.bottom) * yThreshold;
          gradient.addColorStop(offset, "darkviolet");
          gradient.addColorStop(offset, "darkviolet");
          gradient.addColorStop(1, "blue");
          chart.data.datasets[0].borderColor = gradient;
          ctx.restore();
        },
      },
    ],

    data: {
      labels: dataForChart.timeLabels,
      datasets: datasets,
    },
    options: {
      scales: {
        x: {
          display: false,
        },
        xAxes: {
          display: true,
          ticks: {
            maxTicksLimit: 5,
          },
        },
        "time-axis": {
          display: false,
        },

        y: {
          display: false,
        },
        "pressure-axis": {
          title: {
            display: true,
            text: "hPa",
            align: "end",
          },
          type: "linear",
          beginAtZero: false,
          max: 1040,
          position: "right",
          ticks: {
            stepSize: 10,
            color: "rgb(100, 100, 100)",
          },
        },

        "temperature-axis": {
          title: {
            display: true,
            text: "°C",
            align: "end",
          },
          beginAtZero: true,
          position: "left",
          ticks: {
            stepSize: 2,
            color: function (tick) {
              if (tick.tick.value > 0) {
                return "rgb(186, 53, 46)";
              } else if (tick.tick.value <= 0) {
                return "rgb(100, 120, 255)";
              }
              console.log(tick.tick.value);
              return "#000000";
            },
          },
          grid: {},
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function getDataForChart(jsonData) {
  const weatherList = jsonData.list;
  const timeLabels = [];
  const temperatures = [];
  const pressures = [];

  weatherList.forEach((weather) => {
    const date = moment(weather.dt_txt, "YYYY-MM-DD HH:mm:ss");
    const formattedDate = date.format("DD MMM");

    const temperature = weather.main.temp;
    const pressure = weather.main.pressure;

    timeLabels.push(formattedDate);
    temperatures.push(temperature);
    pressures.push(pressure);
  });

  return { timeLabels, temperatures, pressures };
}

function setCurrentDate() {
  const currentDate = new Date();

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  currentDateElement.textContent = formattedDate;
}
