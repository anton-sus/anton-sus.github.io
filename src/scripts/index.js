document.addEventListener("DOMContentLoaded", function () {
  let searchInput = document.getElementById("searchInput");
  let searchButton = document.getElementById("searchButton");

  let cityTitle = document.getElementById("cityTitle");
  let cityInfo = document.getElementById("cityInfo");

  searchInput.style.display = "none";

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
      event.target.id !== "searchButton"
    ) {
      searchInput.style.display = "none";
    }
  });

  // получение значения из searchInput, поиск координат, запрос weatherData
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      let cityName = searchInput.value;
      console.log(cityName);
  
      fetchCityData(cityName)
        .then((coords) => {
          console.log(coords.lat, coords.lon);
          let cityDescription =  `${coords.state} (${coords.country}) - ${coords.lat}°N, ${coords.lat}30°E`;
          cityTitle.innerHTML = coords.foundCityName;
          cityInfo.innerHTML = cityDescription;
          return fetchWeatherData(coords.lat, coords.lon);
        })
        .then((weatherData) => {
          console.log(weatherData);
          // Сохранение cityName в localStorage
          localStorage.setItem("searches", JSON.stringify(cityName));
        })
        .catch((error) => console.error("Ошибка fetchCityData:", error));
    }
  });
});
