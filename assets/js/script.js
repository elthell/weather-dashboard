// universal selectors
let searchBtn = document.querySelector("#search-btn");
let searchResults = document.querySelector("#search-results");
let cityWeather = document.querySelector("#city-weather");
let cityForecast = document.querySelector("#forecast");

// event listener for search button
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();

  // variable to capture entered city
  let cityInput = document.getElementById("city-input").value;
  localStorage.setItem("input", cityInput);
  // trigger function for city search if a city was entered
  if (cityInput) {
    getCityCoords(cityInput);

    document.getElementById("city-input").value = "";
    cityForecast.textContent = "";
    cityWeather.textContent = "";
    // else ask for a city
  } else {
    alert("Please enter a city formatted by city, state");
  }

  savedSearches();
});

// function to save city searches to field
let savedSearches = function () {
  // create button for each saved city search
  let prevCity = document.createElement("button");
  prevCity.classList = "btn btn-outline-primary";
  prevCity.textContent = localStorage.getItem("input");
  searchResults.appendChild(prevCity);

  //event listener to retrigger that cities search
  prevCity.addEventListener("click", function (event) {
    event.preventDefault();

    let cityInput = prevCity.textContent;
    getCityCoords(cityInput);

    document.getElementById("city-input").value = "";
    cityForecast.textContent = "";
    cityWeather.textContent = "";
  });
};

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
      getCityForecast(cityLat, cityLon);
    });
};

// get current city weather
let getCityWeather = function (lat, lon) {
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=10f2a4299cb936661259de80cf95e163&units=imperial";

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // create elements to display city weather
      let cityName = document.createElement("h3");

      // get time and convert from unix
      let time = new Date(data.dt * 1000);
      cityName.textContent = data.name + " (" + time.toDateString() + ")";

      // get img
      let cityImg = document.createElement("img");
      cityImg.src =
        "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";

      // other values
      let cityTemp = document.createElement("p");
      cityTemp.textContent = "Temp: " + data.main.temp + "°F";
      let cityHumid = document.createElement("p");
      cityHumid.textContent = "Humidity: " + data.main.humidity + "%";
      let cityWind = document.createElement("p");
      cityWind.textContent = "Wind: " + data.wind.speed + " mph";

      // give container a darker bg to display weather images
      cityWeather.classList.add("bg-secondary-subtle", "bg-gradient", "rounded");

      // append to weather container
      cityName.appendChild(cityImg);
      cityWeather.appendChild(cityName);
      cityWeather.appendChild(cityTemp);
      cityWeather.appendChild(cityHumid);
      cityWeather.appendChild(cityWind);
    });
};

// get city weather forecast
let getCityForecast = function (lat, lon) {
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=10f2a4299cb936661259de80cf95e163&units=imperial";

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // select middle of each date for best average values
      let forecastDays = [
        data.list[4],
        data.list[12],
        data.list[20],
        data.list[28],
        data.list[36],
      ];
      for (var i = 0; i < forecastDays.length; i++) {
        // make card for each day
        let forecastCard = document.createElement("div");
        forecastCard.classList.add(
          "col",
          "bg-primary-subtle",
          "bg-gradient",
          "rounded",
          "text-center",
          "p-2",
          "m-3"
        );
        cityForecast.appendChild(forecastCard);

        // get value for time, stringify, set
        let time = new Date(forecastDays[i].dt_txt);
        let forecastDate = document.createElement("h4");
        forecastDate.classList.add("card-title")
        forecastDate.textContent = time.toDateString();
        forecastCard.appendChild(forecastDate);

        // get img
        let forecastImg = document.createElement("img");
        forecastImg.src =
          "https://openweathermap.org/img/wn/" +
          forecastDays[i].weather[0].icon +
          ".png";
          forecastCard.appendChild(forecastImg)

        // other values from array
        let forecastTemp = document.createElement("p");
        forecastTemp.textContent = "Temp: " + forecastDays[i].main.temp + "°F";
        forecastCard.appendChild(forecastTemp);

        let forecastHumid = document.createElement("p");
        forecastHumid.textContent = "Humidity: " + forecastDays[i].main.humidity + "%";
        forecastCard.appendChild(forecastHumid);

        let forecastWind = document.createElement("p");
        forecastWind.textContent = "Wind: " + forecastDays[i].wind.speed + "mph";
        forecastCard.appendChild(forecastWind);
      }
    });
};
