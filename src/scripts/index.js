document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

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

  // получение значения из input
  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      console.log(searchInput.value);

      localStorage.setItem("searches", searchInput.value);
    }
  });
});
