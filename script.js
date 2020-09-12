$(function () {
  const apiKey = "593c0385215d05c9409439d0b1361f3e";
  var cityName = "Atlanta"; //TODO: make dynamic

  var currentWeatherQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    apiKey;

  //Current weather API Calls
  $.ajax({
    url: currentWeatherQueryURL,
    method: "GET",
  }).then(function (response) {
    // console.log(currentWeatherQueryURL);

    $("#current-city-name").text(response.name);
    //TODO: add today's date
    $("#current-weather-icon").attr(
      "src",
      "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
    );

    $("#current-temp").text("Temperature: " + response.main.temp + " °F");

    $("#current-humidity").text("Humidity: " + response.main.humidity + "%");

    $("#wind-speed").text("Wind speed: " + response.wind.speed + " MPH");

    var latitude = response.coord.lat;
    var longitude = response.coord.lon;

    //current UV API Call
    var currentUVQueryURL =
      "http://api.openweathermap.org/data/2.5/uvi?appid=" +
      apiKey +
      "&lat=" +
      latitude +
      "&lon=" +
      longitude;

    $.ajax({
      url: currentUVQueryURL,
      method: "GET",
    }).then(function (response) {
      $("#current-uv").text("UV Index: ");
      $("#uv-icon").text(response.value);
      //TODO: UV index colors
    });

    //Forecast call
    var forecastQueryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&exclude=current,minutely,hourly&appid=" +
      apiKey;

    console.log(forecastQueryURL);

    $.ajax({
      url: forecastQueryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response.daily);
    });
  });
});
