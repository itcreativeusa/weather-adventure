/* Declare variables */
var latitude;
var longitude;
var capitalizedAddress; // Capitalized address for display
var button = document.querySelector("#button");
button.addEventListener("click", fetchHandler); // Add event listener to button
var weatherMap; // Declare weatherMap globally
var mapLink; // Declare mapLink globally

/* Function to display clothing suggestions */
function displayClothingSuggestions(temperature, weatherCondition) {
  var clothingSuggestion = ""; // Clothing suggestions

  /* Clothing suggestions based on temperature */
  if (temperature > 100) {
    clothingSuggestion +=
      "<p>Who turned up the heat? Stay indoors and keep hydrated. </p>";
  } else if (temperature > 95) {
    clothingSuggestion +=
      "<p>It's sizzling! Light and breathable clothing is your best bet. </p>";
  } else if (temperature > 90) {
    clothingSuggestion +=
      "<p>Hot stuff! T-shirt and shorts are the way to go. </p>";
  } else if (temperature > 85) {
    clothingSuggestion +=
      "<p>Feeling warm! Opt for light clothing to stay cool. </p>";
  } else if (temperature > 80) {
    clothingSuggestion +=
      "<p>Warm vibes! T-shirt and shorts would be perfect. </p>";
  } else if (temperature > 75) {
    clothingSuggestion +=
      "<p>A bit warm! Choose breathable fabrics for comfort. </p>";
  } else if (temperature > 70) {
    clothingSuggestion +=
      "<p>Cool and comfy! A light jacket or sweater might be nice. </p>";
  } else if (temperature > 65) {
    clothingSuggestion +=
      "<p>Chill in the air! Consider layering with a light jacket. </p>";
  } else if (temperature > 60) {
    clothingSuggestion +=
      "<p>Cool breeze! A light jacket or sweater would be perfect. </p>";
  } else if (temperature > 55) {
    clothingSuggestion +=
      "<p>Chilly weather! Grab a light jacket or sweater. </p>";
  } else if (temperature > 50) {
    clothingSuggestion +=
      "<p>Cold a bit. Bundle up with a warm jacket and sweater. </p>";
  } else if (temperature > 45) {
    clothingSuggestion +=
      "<p>Brisk and cold! Insulated outerwear will keep you warm. </p>";
  } else if (temperature > 40) {
    clothingSuggestion +=
      "<p>Cold! Heavy coat, hat, scarf, and gloves needed. </p>";
  } else if (temperature > 35) {
    clothingSuggestion +=
      "<p>Frigid conditions! Dress in layers with insulated clothing. </p>";
  } else if (temperature > 30) {
    clothingSuggestion +=
      "<p>Cold! Limit outdoor exposure and wear the warmest clothing. </p>";
  } else if (temperature > 20) {
    clothingSuggestion +=
      "<p>Bitterly cold! Limit outdoor exposure and bundle up. </p>";
  } else if (temperature > 10) {
    clothingSuggestion +=
      "<p>Frosty weather! Limit outdoor exposure and wear the warmest clothing. </p>";
  } else if (temperature > 0) {
    clothingSuggestion +=
      "<p>Freezing point! Limit outdoor exposure and bundle up. </p>";
  } else if (temperature > -10) {
    clothingSuggestion +=
      "<p>Extreme cold alert! Stay indoors and wear the warmest clothing. </p>";
  } else {
    clothingSuggestion +=
      "<p>Bone-chilling cold! Stay indoors and bundle up for warmth. </p>";
  }

  /* Clothing suggestions based on weather condition */
  switch (weatherCondition) {
    case "Rain":
      clothingSuggestion +=
        "<p>It's raining! Don't forget your umbrella, rain jacket, and waterproof boots. </p>";
      break;
    case "Snow":
      clothingSuggestion +=
        "<p>It's snowing! Bundle up with a heavy coat and snow boots. </p>";
      break;
    case "Thunderstorm":
      clothingSuggestion +=
        "<p>Thunderstorm alert! Stay indoors and avoid heavy clothing. </p>";
      break;
    case "Clear":
      clothingSuggestion +=
        "<p>Clear sky. Don't forget sunglasses at daytime. Perfect day for a walk. </p>";
      break;
    case "Clouds":
      clothingSuggestion +=
        "<p>Partly cloudy. Dress comfortably. Good day for a walk. </p>";
      break;
    case "Mist":
      clothingSuggestion +=
        "<p>Mist! Wear a rain jacket and waterproof boots. </p>";
      break;
    default:
      clothingSuggestion +=
        "<p>Weather conditions are diverse! Dress accordingly. </p>";
  }

  /* Display the clothing suggestions directly in the card-section*/
  $(".card-section").append(
    "<div class='clothing-suggestions'> <h5>What to wear today in " +
      capitalizedAddress +
      ":</h5><div class='clothing-suggestions-text'>" +
      clothingSuggestion +
      "</div></div>"
  );
}
/* Function start fetch geocode API & OpenWeatherMap API on click search button */
function fetchHandler(event) {
  event.preventDefault();
  var address = document.getElementById("address-search").value;
  // Capitalize the address
  capitalizedAddress = address
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  // Log the address to the console
  console.log("address-input:", capitalizedAddress);
  // Fetch the geocode data
  fetch("https://geocode.maps.co/search?q=" + capitalizedAddress)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data && data.length > 0) {
        latitude = data[0].lat;
        longitude = data[0].lon;
      } else {
        console.error("Invalid geocode data:", data);
      }
    })
    .then(function () {
      // Log the latitude and longitude to the console
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      // Check if latitude and longitude are valid
      if (!latitude || !longitude) {
        throw new Error("Invalid latitude or longitude");
      }
      // Fetch the weather data
      return fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&units=imperial&appid=a89d772f92e60a988c309ad27ee68c1c"
      );
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (weatherData) {
      console.log("weather-response:", weatherData);
      /* Display or process the weather information */
      var temperature = parseInt(weatherData.main.temp);
      var weatherCondition = weatherData.weather[0].main;
      var feelsLike = parseInt(weatherData.main.feels_like);
      var humidity = weatherData.main.humidity;
      var windSpeed = weatherData.wind.speed;
      var weather = weatherData.weather[0].main;
      var weatherIcon = weatherData.weather[0].icon;
      var weatherIconURL =
        "http://openweathermap.org/img/w/" + weatherIcon + ".png";

      // Log the weather information to the console
      console.log("Temperature:", temperature);
      console.log("Feels Like:", feelsLike);
      console.log("Humidity:", humidity);
      console.log("Wind Speed:", windSpeed);
      console.log("Weather:", weather);
      console.log("Weather Icon:", weatherIcon);
      console.log("Weather Icon URL:", weatherIconURL);
      // Display the weather information in the card-section
      $(".card-section").html(""); // Clear existing content
      $(".card-section").append(
        "<h4>Weather in " + capitalizedAddress + "</h4>",
        "<p><span class='icons'>" +
          temperature +
          " &#8457;</span></p><img src='" +
          weatherIconURL +
          "' alt='Weather Icon' style='width: 100px; height: 100px;'>",
        "<p>Feels Like: " + feelsLike + " &#8457;</p>",
        "<p>Humidity: " + humidity + " %</p>",
        "<p>Wind Speed: " + windSpeed + " m/s</p>"
      );
      // Call displayClothingSuggestions
      displayClothingSuggestions(temperature, weatherCondition);

      getMap(latitude, longitude);
    })
    .catch((error) => {
      console.error("Error fetching weather or geocode data:", error);
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
    // Save the user input to local storage
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
var resultCardSection = "<div class='medium-6 cell card-section'></div>";
$(".result-card-content").append(resultCardSection);
var resultCardMap =
  "<div class='medium-6 cell card-map'><div id='weatherMap' alt='Weather Map'></div></div>";
$(".result-card-content").append(resultCardMap);

weatherMap = L.map("weatherMap");
// Add OpenStreetMap layer
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
}).addTo(weatherMap);
var apiKey = "a89d772f92e60a988c309ad27ee68c1c"; // API key

L.tileLayer(
  "https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={apiKey}",
  {
    attribution: '<a href="https://openweathermap.org/">OpenWeather</a>',
    layer: "clouds_new",
    apiKey: apiKey,
  }
).addTo(weatherMap);

//weatherMap.setView([50.45, 30.52], 10);
function getMap(lat, long) {
  weatherMap.setView([lat, long], 5);
  console.log("Map view updated.");
}

// Call fetchWeatherMap after the map is loaded
function loadData() {
  var input = document.getElementById("address-search");
  var saveAddress = localStorage.getItem("listing");
  input.value = saveAddress;
}

// Call fetchWeatherMap after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded");
});

// Call loadData after the page is loaded
loadData();
