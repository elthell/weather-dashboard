// universal selectors
let searchBtn = document.querySelector("#search-btn");
let searchResults = document.querySelector("#search-results");
let cityWeather = document.querySelector("#city-weather");
let forecastDays = document.querySelector("#forecast-days");

// event listener for search button
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // variable to capture entered city
  let cityInput = document.getElementById("city-input").value;

  // trigger function for city search if a city was entered
  if (cityInput) {
    getCityCoords(cityInput);

    document.getElementById("city-input").value = "";
    forecastDays.innerHTML = "";
    cityWeather.innerHTML = "";
    // else ask for a city
  } else {
    alert("Please enter a city formatted by city, state");
  }
});

// function to get city coords
let getCityCoords = function (input) {
  let apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    input +
    "&limit=1&appid=10f2a4299cb936661259de80cf95e163";

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    // get lat and lon and send on to next request
    .then(function (data) {
      let cityLat = data[0].lat;
      let cityLon = data[0].lon;
      getCityWeather(cityLat, cityLon);
    });
};

// get city weather forecast using coords
let getCityWeather = function (lat, lon) {
  let apiUrl =
    "http://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=10f2a4299cb936661259de80cf95e163&units=imperial";

    fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
};
