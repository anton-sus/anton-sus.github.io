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
        .then((cityData) => {
          console.log(cityData.lat, cityData.lon);
          let cityDescription =  `${cityData.state} (${cityData.country}) - ${cityData.lat}°N, ${cityData.lat}30°E`;
          cityTitle.innerHTML = cityData.foundCityName;
          cityInfo.innerHTML = cityDescription;
          
          searchInput.style.display = "none"
          
          return fetchWeatherData(cityData.lat, cityData.lon);
        })
        .then((weatherData) => {
          console.log(weatherData); // ошибка undefined
          // Сохранение cityName в localStorage
          localStorage.setItem("searches", JSON.stringify(cityName));
        })
        .catch((error) => console.error("Ошибка fetchCityData:", error));
    }
  });
});
