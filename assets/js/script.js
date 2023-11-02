/*Declare variables*/
var button = document.querySelector("#button");
button.addEventListener("click", fetchHandler);
var latitude;
var longitude;
var listings = [];

/*Function start fetch geocode API & OpenWeatherMap API on click search button */
function fetchHandler(event) {
  event.preventDefault();
  var address = document.getElementById("address-search").value;
  console.log("address-input:", address);

  /*Fetch. Get the longitude and latitude from the address entered by the user*/
  fetch("https://geocode.maps.co/search?q=" + address)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("geocode-response: ", data);
      latitude = data[0].lat;
      longitude = data[0].lon;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      /* Replace Zillow API call with OpenWeatherMap API */
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&appid=393078d647ab46db0fe4c5d56b489027"
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          console.log("weather-response:", weatherData);

          // Display or process the weather information as needed
          var temperature = weatherData.main.temp;
          var humidity = weatherData.main.humidity;
          var windSpeed = weatherData.wind.speed;
          var weatherDescription = weatherData.weather[0].description;
          var pressure = weatherData.main.pressure;
          var visibility = weatherData.visibility;

          // Continue with your existing code to display or process weather information...

          // Clear existing content
          $(".card-section").empty();

          // Display weather information
          $(".card-section").append(
            "<h4>Weather Information</h4>",
            "<p>Temperature: " + temperature + " &#8451;</p>",
            "<p>Humidity: " + humidity + " %</p>",
            "<p>Wind Speed: " + windSpeed + " m/s</p>",
            "<p>Pressure: " + pressure + " hPa</p>",
            "<p>Visibility: " + visibility + " m</p>",
            "<p>Weather: " + weatherDescription + "</p>"
          );
        })
        .catch(function (error) {
          console.error("Error fetching weather data:", error);
        });
    })
    .catch(function (error) {
      console.error("Error fetching geocode data:", error);
    });
}

/* Function show results on click or alert if empty*/
$(document).ready(function () {
  $("button").click(function () {
    if (!$("#address-search").val()) {
      $(".form-input").append(
        "<p>Enter Street Address, City and Zip Code!</p>"
      );
    } else {
      $(".result").removeClass("hidden");
    }

    var listing = document.getElementById("address-search").value;
    localStorage.setItem("listing", listing);
  });
});

/* Create & add elements using jquery*/
var resultCardBlock = "<div class='result-card'></div>";
$(".result").append(resultCardBlock);
var resultCardContent =
  "<div class='grid-x grid-margin-x result-card-content'></div>";
$(".result-card").append(resultCardContent);
var resultCardTitle = "<div class='card-section'></div>";
$(".result-card-content").append(resultCardTitle);
/*Create footer with github link*/
var footer =
  "<footer class='text-center'><a href='https://github.com/neilmkflyingk/house-hunters'><i class='fi-social-github'>Kateryna Stetsenko</i></a></footer>";
$(".result").append(footer);

$(function () {
  loadData();
});

/*Local storage*/
function loadData() {
  var input = document.getElementById("address-search");
  var saveAddress = localStorage.getItem("listing");
  input.value = saveAddress;
}
