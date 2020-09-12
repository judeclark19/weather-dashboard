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
    $("#current-weather-icon").attr("src", "http://openweathermap.org/img/wn/"+response.weather[0].icon+".png")


    console.log(response.weather[0].icon+".png");
    console.log("Temp in F: " + response.main.temp);
    console.log("Humidity: " + response.main.humidity + "%");
    console.log("Wind speed: " + response.wind.speed + " mph");

    var latitude = response.coord.lat;
    console.log("Latitude: " + latitude);
    var longitude = response.coord.lon;
    console.log("Longitude: " + longitude);

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
      console.log(UVQueryURL);
      console.log("UV Index :" + response.value);
    });
  });

});
