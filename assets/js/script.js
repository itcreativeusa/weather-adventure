/* Declare variables */
var latitude;
var longitude;
var capitalizedAddress;
var layer = "clouds_new";
var button = document.querySelector("#button");
button.addEventListener("click", fetchHandler);

/* Function to display clothing suggestions */
function displayClothingSuggestions(temperature, weatherCondition) {
  var clothingSuggestion = "";

  /* Clothing suggestions based on temperature */
  if (temperature > 100) {
    clothingSuggestion +=
      "Who turned up the heat? Stay indoors and keep hydrated. ";
  } else if (temperature > 95) {
    clothingSuggestion +=
      "It's sizzling! Light and breathable clothing is your best bet. ";
  } else if (temperature > 90) {
    clothingSuggestion += "Hot stuff! T-shirt and shorts are the way to go. ";
  } else if (temperature > 85) {
    clothingSuggestion += "Feeling warm! Opt for light clothing to stay cool. ";
  } else if (temperature > 80) {
    clothingSuggestion += "Warm vibes! T-shirt and shorts would be perfect. ";
  } else if (temperature > 75) {
    clothingSuggestion += "A bit warm! Choose breathable fabrics for comfort. ";
  } else if (temperature > 70) {
    clothingSuggestion +=
      "Cool and comfy! A light jacket or sweater might be nice. ";
  } else if (temperature > 65) {
    clothingSuggestion +=
      "Chill in the air! Consider layering with a light jacket. ";
  } else if (temperature > 60) {
    clothingSuggestion +=
      "Cool breeze! A light jacket or sweater would be perfect. ";
  } else if (temperature > 55) {
    clothingSuggestion += "Chilly weather! Grab a light jacket or sweater. ";
  } else if (temperature > 50) {
    clothingSuggestion +=
      "Cold a bit. Bundle up with a warm jacket and sweater. ";
  } else if (temperature > 45) {
    clothingSuggestion +=
      "Brisk and cold! Insulated outerwear will keep you warm. ";
  } else if (temperature > 40) {
    clothingSuggestion += "Cold! Heavy coat, hat, scarf, and gloves needed. ";
  } else if (temperature > 35) {
    clothingSuggestion +=
      "Frigid conditions! Dress in layers with insulated clothing. ";
  } else if (temperature > 30) {
    clothingSuggestion +=
      "Cold! Limit outdoor exposure and wear the warmest clothing. ";
  } else if (temperature > 20) {
    clothingSuggestion +=
      "Bitterly cold! Limit outdoor exposure and bundle up. ";
  } else if (temperature > 10) {
    clothingSuggestion +=
      "Frosty weather! Limit outdoor exposure and wear the warmest clothing. ";
  } else if (temperature > 0) {
    clothingSuggestion +=
      "Freezing point! Limit outdoor exposure and bundle up. ";
  } else if (temperature > -10) {
    clothingSuggestion +=
      "Extreme cold alert! Stay indoors and wear the warmest clothing. ";
  } else {
    clothingSuggestion +=
      "Bone-chilling cold! Stay indoors and bundle up for warmth. ";
  }

  /* Clothing suggestions based on weather condition*/
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
        "Clear sky. Don't forget sunglasses at daytime. Perfect day for a walk. ";
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
  /* Display the clothing suggestions directly in the card-section*/
  $(".card-section").append(
    "<div class='clothing-suggestions'> <h5>What to wear today in " +
      capitalizedAddress +
      ":</h5><p>" +
      clothingSuggestion +
      "</p></div>"
  );
}

/* Function start fetch geocode API & OpenWeatherMap API on click search button */
function fetchHandler(event) {
  event.preventDefault();
  var address = document.getElementById("address-search").value;

  /* Capitalize each word in the address*/
  capitalizedAddress = address
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

      /* Display or process the weather information */
      var temperature = parseInt(weatherData.main.temp);
      var weatherCondition = weatherData.weather[0].main;
      var feelsLike = parseInt(weatherData.main.feels_like);
      var humidity = weatherData.main.humidity;
      var windSpeed = weatherData.wind.speed;
      /* clouds could be used to display cloud later */
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

      /* Call the function to display clothing suggestions */
      displayClothingSuggestions(temperature, weatherCondition);

      /* Call the function to fetch and set the OpenWeatherMap tile with user input coordinates*/
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
var resultCardSection = "<div class='medium-6 cell card-section'></div>";
$(".result-card-content").append(resultCardSection);
var resultCardMap =
  "<div class='medium-6 cell card-map'><img id='weatherMap' src='' alt='Weather Map'></div>";
$(".result-card-content").append(resultCardMap);

/* Function to fetch and set the OpenStreetMap tile with user input coordinates */
function fetchWeatherMap(latitude, longitude) {
  console.log(
    "Before map initialization. Map Element:",
    document.getElementById("map")
  );

  // Check if map container is present
  console.log(
    "Before map initialization. Map Element:",
    document.getElementById("map")
  );

  // Wait for the DOM to be fully loaded
  document.addEventListener("DOMContentLoaded", function () {
    // Create a new map
    map = L.map("map").setView([latitude, longitude], 10);

    console.log(
      "After map initialization. Map Element:",
      document.getElementById("map")
    );
  });

  // Ensure that latitude and longitude are valid numbers
  if (isNaN(latitude) || isNaN(longitude)) {
    console.error("Invalid latitude or longitude");
    return;
  }

  // OpenWeatherMap Api Key
  var apiKey = "a89d772f92e60a988c309ad27ee68c1c";
  // OpenWeatherMap URL
  var weatherMapURL = `https://tile.openweathermap.org/map/${layer}/${zoom}/${latitude}/${longitude}.png?appid=${apiKey}`;

  // Log the weatherMapURL to the console
  console.log("Weather Map URL:", weatherMapURL);
  console.log("Latitude:", latitude);
  console.log("Longitude:", longitude);

  // Set the source of the weather map image
  $("#weatherMap").attr("src", weatherMapURL);

  // Append the OpenStreetMap link to the card-section
  $(".card-section").append(openStreetMapLinkElement);
}

/* Local storage */
function loadData() {
  var input = document.getElementById("address-search");
  var saveAddress = localStorage.getItem("listing");
  input.value = saveAddress;
}
loadData();
