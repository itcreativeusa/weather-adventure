/* Declare variables */
var latitude;
var longitude;
var button = document.querySelector("#button");
button.addEventListener("click", fetchHandler);

/* Function to display clothing suggestions */
function displayClothingSuggestions(temperature, weatherCondition) {
  var clothingSuggestion = "";

  // Clothing suggestions based on temperature
  if (temperature > 90) {
    clothingSuggestion +=
      "It's hot! Consider light and breathable clothing. Don't forget sunscreen. ";
  } else if (temperature > 80) {
    clothingSuggestion +=
      "It's warm! T-shirt and shorts would be comfortable. ";
  } else if (temperature > 70) {
    clothingSuggestion +=
      "It's cool! A light jacket or sweater might be nice. ";
  } else if (temperature > 60) {
    clothingSuggestion += "It's a bit cold. Wear a jacket. ";
  } else if (temperature > 50) {
    clothingSuggestion += "It's cold! Bundle up with a warm jacket and hat. ";
  } else if (temperature > 40) {
    clothingSuggestion += "It's too cold! Wear a heavy coat and hat. ";
  } else {
    clothingSuggestion += "It's freezing! Wear a heavy coat, hat, and gloves. ";
  }

  // Clothing suggestions based on weather condition
  switch (weatherCondition) {
    case "Rain":
      clothingSuggestion +=
        "It's raining! Don't forget your umbrellarain, rain jacket and waterproof boots. ";
      break;
    case "Snow":
      clothingSuggestion +=
        "It's snowing! Bundle up with a heavy coat and snow boots. ";
      break;
    case "Thunderstorm":
      clothingSuggestion +=
        "Thunderstorm alert! Stay indoors and avoid heavy clothing. ";
      break;
    case "Clear":
      clothingSuggestion +=
        "Clear sky. Sunglasses and a light outfit would be great. ";
      break;
    case "Clouds":
      clothingSuggestion +=
        "Partly cloudy. Dress comfortably. Good day for a walk. ";
      break;
    case "Mist":
      clothingSuggestion += "Mist! Wear a rain jacket and waterproof boots. ";
      break;

    default:
      clothingSuggestion +=
        "Weather conditions are diverse! Dress accordingly. ";
  }
  // Display the clothing suggestions directly in the card-section
  $(".card-section").append(
    "<div class='clothing-suggestions'> <h5>What to wear today:</h5><p>" +
      clothingSuggestion +
      "</p></div>"
  );
}

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
      if (data && data.length > 0) {
        latitude = data[0].lat;
        longitude = data[0].lon;
      } else {
        console.error("Invalid geocode data:", data);
      }
    })
    .then(function () {
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      /* OpenWeatherMap API */
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

      // Display or process the weather information as needed
      var temperature = weatherData.main.temp;
      var weatherCondition = weatherData.weather[0].main;

      var feelsLike = weatherData.main.feels_like;
      var humidity = weatherData.main.humidity;
      var windSpeed = weatherData.wind.speed;
      var clouds = weatherData.clouds.all;

      var weather = weatherData.weather[0].main;
      var weatherIcon = weatherData.weather[0].icon;
      var weatherIconURL =
        "http://openweathermap.org/img/w/" + weatherIcon + ".png";

      console.log("Temperature:", temperature);
      console.log("Feels Like:", feelsLike);
      console.log("Humidity:", humidity);
      console.log("Wind Speed:", windSpeed);

      console.log("Weather:", weather);
      console.log("Weather Icon:", weatherIcon);
      console.log("Weather Icon URL:", weatherIconURL);

      $(".card-section").html(""); // Clear existing content
      $(".card-section").append(
        "<h4>Weather in " + capitalizedAddress + "</h4>",
        "<p><span class='icons'>" +
          temperature +
          " &#8457;</span> <img src='" +
          weatherIconURL +
          "' alt='Weather Icon' style='width: 100px; height: 100px;'></p>",
        "<p>Feels Like: " + feelsLike + " &#8457;</p>",
        "<p>Humidity: " + humidity + " %</p>",
        "<p>Wind Speed: " + windSpeed + " m/s</p>"
      );

      // Call the function to display clothing suggestions
      displayClothingSuggestions(temperature, weatherCondition);

      // Call the function to fetch and set the OpenWeatherMap tile with user input coordinates
      fetchWeatherMap(latitude, longitude);
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
  "<div class='medium-6 cell card-map'><img id='weatherMap' src='' alt='Weather Map'></div>";
$(".result-card-content").append(resultCardMap);

/* Function to fetch and set the OpenStreetMap tile with user input coordinates */
function fetchWeatherMap(latitude, longitude) {
  var map = L.map("map").setView([latitude, -longitude], 10); // Adjust the sign of longitude here

  // Add OpenStreetMap tile layer to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Additional code for OpenWeatherMap layer
  var layer = "temp";
  var zoom = 10;

  // OpenStreetMap link
  var openStreetMapLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=10/${latitude}/${absLongitude}`;
  console.log("OpenStreetMap Link:", openStreetMapLink);

  // Create a new HTML element for OpenStreetMap link
  var openStreetMapLinkElement = document.createElement("a");
  openStreetMapLinkElement.href = openStreetMapLink;
  openStreetMapLinkElement.textContent = "View on OpenStreetMap";
  openStreetMapLinkElement.target = "_blank"; // Open link in a new tab

  // Use the absolute value of longitude for OpenWeatherMap URL
  var absLongitude = Math.abs(longitude);

  // Convert latitude and longitude to integers
  latitude = parseInt(latitude, 10);
  absLongitude = parseInt(absLongitude, 10);

  // Ensure that latitude and longitude are valid numbers
  if (isNaN(latitude) || isNaN(absLongitude)) {
    console.error("Invalid latitude or longitude");
    return;
  }

  var apiKey = "a89d772f92e60a988c309ad27ee68c1c";

  var weatherMapURL = `https://tile.openweathermap.org/map/${layer}/${zoom}/${latitude}/${absLongitude}.png?appid=${apiKey}`;

  // Log the weatherMapURL to the console
  console.log("Weather Map URL:", weatherMapURL);
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  // Set the source of the weather map image
  $("#weatherMap").attr("src", weatherMapURL);
}
/* Local storage */
function loadData() {
  var input = document.getElementById("address-search");
  var saveAddress = localStorage.getItem("listing");
  input.value = saveAddress;
}
loadData();
