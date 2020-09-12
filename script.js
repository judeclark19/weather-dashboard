$(function () {
  const forecastArray = ["Tomorrow", "day 2", "day 3", "day 4", "day  5"];
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

    $("#current-city-name").text(response.name + " TODAY'S DATE");
    //TODO: add today's date
    $("#current-weather-icon").attr(
      "src",
      "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
    );

    $("#current-temp").text(
      "Temperature: " + parseInt(response.main.temp) + " °F"
    );

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
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" +
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
     
      //Loop to create forecast cards (starting on index 1 because 0 is today and we don't need today)
      for (let i = 1; i < forecastArray.length + 1; i++) {
        //create div class card forecast-card-body
        // create h5 DoW
        // create hr
        // create p to hold icon
          //create icon and apppend
        //create P to hold temp
        //create p to hold humidity

        //append Ps to .forecast-card-body
        //append .forecast-card-body to .card
        //append card to #forecast-row



        //get day of week
        var unixSeconds = response.daily[i].dt;
        var unixMilliseconds = unixSeconds * 1000;
        var forecastDateUnix = new Date(unixMilliseconds);
        var forecastDoW = forecastDateUnix.toLocaleString("en-US", {
          weekday: "long",
        });
        console.log(forecastDoW);

        //get weather icon
        console.log(response.daily[i].weather[0].icon);
        // "http://openweathermap.org/img/wn/" + response.daily[1].weather[0].icon + ".png"

         //get temp
      console.log(
        parseInt(response.daily[i].temp.day)
        );

        //get humidity
      console.log(response.daily[i].humidity);
      }
    });
  });
});
