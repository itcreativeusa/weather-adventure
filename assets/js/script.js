/* Declare variables */
var latitude;
var longitude;
var button = document.querySelector("#button");
button.addEventListener("click", fetchHandler);

/* Function start fetch geocode API & OpenWeatherMap API on click search button */
function fetchHandler(event) {
  event.preventDefault();
  var address = document.getElementById("address-search").value;

  // Capitalize each word in the address
  var capitalizedAddress = address
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  console.log("address-input:", capitalizedAddress);

  /* Fetch. Get the longitude and latitude from the address entered by the user */
  fetch("https://geocode.maps.co/search?q=" + capitalizedAddress)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Inside the fetchHandler function after getting latitude and longitude from geocode API
      latitude = parseFloat(data[0].lat).toFixed(4);
      longitude = parseFloat(data[0].lon).toFixed(4);
      console.log("Raw Longitude:", data[0].lon);

      // Adjust the longitude to be positive if it's negative
      if (longitude < 0) {
        longitude = Math.abs(longitude);
      }

      // Convert latitude and longitude to integers
      latitude = parseInt(latitude, 10);
      longitude = parseInt(longitude, 10);

      console.log("Final Latitude:", latitude);
      console.log("Final Longitude:", longitude);
      /* OpenWeatherMap API */
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&units=imperial&appid=a89d772f92e60a988c309ad27ee68c1c"
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          console.log("weather-response:", weatherData);

          console.log("weather-raw-response:", weatherData);

          // Display or process the weather information as needed
          var temperature = weatherData.main.temp;
          var feelsLike = weatherData.main.feels_like;
          var humidity = weatherData.main.humidity;

          var windSpeed = weatherData.wind.speed;
          var windDirection = weatherData.wind.deg;
          var clouds = weatherData.clouds.all;
          var visibility = weatherData.visibility;
          var weather = weatherData.weather[0].main;
          var weatherIcon = weatherData.weather[0].icon;
          var weatherIconURL =
            "http://openweathermap.org/img/w/" + weatherIcon + ".png";

          console.log("Temperature:", temperature);
          console.log("Feels Like:", feelsLike);
          console.log("Humidity:", humidity);
          console.log("Wind Speed:", windSpeed);
          console.log("Clouds:", clouds);
          console.log("Visibility:", visibility);
          console.log("Weather:", weather);
          console.log("Weather Icon:", weatherIcon);
          console.log("Weather Icon URL:", weatherIconURL);

          // Display weather information
          $(".card-section").html(""); // Clear existing content
          $(".card-section").append(
            "<h4>Weather Information in " + capitalizedAddress + "</h4>",
            "<p>Temperature: " + temperature + " &#8457;</p>",
            "<p>Feels Like: " + feelsLike + " &#8457;</p>",
            "<p>Humidity: " + humidity + " %</p>",
            "<p>Wind Speed: " + windSpeed + " m/s</p>",
            "<p>Wind Direction: " + windDirection + " &#176;</p>",
            "<p>Clouds: " + clouds + " %</p>",
            "<p>Visibility: " + visibility + " m</p>",
            "<p>Weather: " +
              weather +
              "<img src='" +
              weatherIconURL +
              "' alt='Weather Icon'></p>"
          );

          // Call the function to fetch and set the OpenWeatherMap tile with user input coordinates
          fetchWeatherMap(latitude, longitude);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching geocode data:", error);
    });
}
/* Function show results on click or alert if empty */
$(document).ready(function () {
  $("button").click(function () {
    if (!$("#address-search").val()) {
      $(".form-input").append("<p>Please enter the city name</p>");
    } else {
      $(".result").removeClass("hidden");
    }

    var listing = document.getElementById("address-search").value;
    localStorage.setItem("listing", listing);
  });
});

/* Create & add elements using jQuery with Foundation classes */
var resultCardBlock = "<div class='result-card'></div>";
$(".result").append(resultCardBlock);
var resultCardContent =
  "<div class='grid-x grid-margin-x result-card-content'></div>";
$(".result-card").append(resultCardContent);

// Foundation classes for medium screens, adjust as needed
var resultCardSection = "<div class='medium-6 cell card-section'></div>";
$(".result-card-content").append(resultCardSection);

var resultCardMap =
  "<div class='medium-6 cell card-map'><h4>Weather map</h4><img id='weatherMap' src='' alt='Weather Map'></div>";
$(".result-card-content").append(resultCardMap);

/* Function to fetch and set the OpenWeatherMap tile with user input coordinates */
function fetchWeatherMap(latitude, longitude) {
  var layer = "temp_new";
  var zoom = 10; // Adjust the zoom level as needed

  // Ensure that latitude and longitude are valid numbers
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid latitude or longitude");
    return;
  }

  var apiKey = "a89d772f92e60a988c309ad27ee68c1c";

  var weatherMapURL = `https://tile.openweathermap.org/map/${layer}/${zoom}/${latitude}/${longitude}.png?appid=${apiKey}`;

  // Log the weatherMapURL to the console
  console.log("Weather Map URL:", weatherMapURL);
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  // Set the source of the weather map image
  $("#weatherMap").attr("src", weatherMapURL);
}

/*Local storage*/
function loadData() {
  var input = document.getElementById("address-search");
  var saveAddress = localStorage.getItem("listing");
  input.value = saveAddress;
}
loadData();
