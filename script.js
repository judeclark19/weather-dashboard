$(function () {
  const apiKey = "593c0385215d05c9409439d0b1361f3e";
  var cityName = "Atlanta";

  var mainQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    apiKey;

  //Current weather API Calls
  $.ajax({
    url: mainQueryURL,
    method: "GET",
  }).then(function (response) {
    console.log(mainQueryURL);

    $("#current-city-name").text(response.name)
    //TODO: add today's date
    $("#current-weather-icon").attr("src", "http://openweathermap.org/img/wn/"+response.weather[0].icon+".png")

    $("#current-temp").text("Temperature: " + response.main.temp+" °F");

    $("#current-humidity").text("Humidity: " + response.main.humidity + "%")

    $("#wind-speed").text("Wind speed: " + response.wind.speed + " MPH")

    var latitude = response.coord.lat;
    var longitude = response.coord.lon;

    //api call for UV
    var UVQueryURL =
      "http://api.openweathermap.org/data/2.5/uvi?appid=" +
      apiKey +
      "&lat=" +
      latitude +
      "&lon=" +
      longitude;

    $.ajax({
      url: UVQueryURL,
      method: "GET",
    }).then(function (response) {
        $("#current-uv").text("UV Index: " + response.value)
        //TODO: UV index colors
    });
  });

});
