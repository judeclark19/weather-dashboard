$(function () {
  const forecastArray = ["Tomorrow", "day 2", "day 3", "day 4", "day  5"]; //might not need, this just hard code the number of days in the loops
  const apiKey = "593c0385215d05c9409439d0b1361f3e";
  var cityName = "Atlanta"; //TODO: make dynamic
  var todaysDate = moment().format("D MMMM YYYY");

  $("#search-btn").on("click", showWeather);

  function showWeather() {
    event.preventDefault();
    $("#header-row").empty();
    $("#current-weather-data").empty();
    $("#forecast-row").empty();
    

    var currentWeatherQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial&appid=" +
      apiKey;

    //API Calls begin
    $.ajax({
      url: currentWeatherQueryURL,
      method: "GET",
    }).then(function (response) {

      //Display header showing City, Date, Icon TODO: add today's date
      cityNameAndDate = $("<h4>").text(response.name+" ("+todaysDate+")")
      currentIconEl = $("<img>").attr("src",
      "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
    );

      $("#header-row").append(cityNameAndDate, currentIconEl)
  
      //Display weather data for the present moment
      currentTempEl = $("<p>").text(
        "Temperature: " + Math.round(response.main.temp) + " °F"
      );
      currentHumidityEl = $("<p>").text(
        "Humidity: " + response.main.humidity + "%"
      );
      currentWindEl = $("<p>").text(
        "Wind speed: " + Math.round(response.wind.speed) + " MPH"
      )
      //append them all together
      $("#current-weather-data").append(currentTempEl, currentHumidityEl, currentWindEl)

    //Grabbing variables with which to call for the UV index
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

        $("#forecast-title").text("5-day Forecast")

        currentUVLabel = $("<span>").text("UV Index: ");
        currentUVBadge = $("<span>").text(response.value);

        $("#current-weather-data").append(currentUVLabel, currentUVBadge)
        
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
      // beginning of forecast call

      $.ajax({
        url: forecastQueryURL,
        method: "GET",
      }).then(function (response) {
        //Loop to create forecast cards. See HTML file for a reference of how this looks when built. (the loops tarts on index 1 because 0 is today and we actually want to start with tomorrow)
        for (let i = 1; i < forecastArray.length + 1; i++) {
          //create card
          var forecastCard = $("<div class='card forecast card-body'>");

          //title of card: day of the week
          var forecastDayEl = $("<h5>");
          //get day of week
          var unixSeconds = response.daily[i].dt;
          var unixMilliseconds = unixSeconds * 1000;
          var forecastDateUnix = new Date(unixMilliseconds);
          var forecastDoW = forecastDateUnix.toLocaleString("en-US", {
            weekday: "long",
          });
          forecastDayEl.text(forecastDoW);

          // create hr
          var hrLine = $("<hr />");

          // create p to hold icon
          var iconPara = $("<p>");
          //create icon and append to p
          var iconImg = $("<img>");
          iconImg.attr(
            "src",
            "http://openweathermap.org/img/wn/" +
              response.daily[i].weather[0].icon +
              ".png"
          );
          iconPara.append(iconImg);

          //create P to hold temp
          var tempPara = $("<p>").text("Temp: "+
            Math.round(response.daily[i].temp.day) + " °F"
          );

          //create p to hold humidity
          var humidPara = $("<p>").text("Humidity: "+response.daily[i].humidity+"%");

          //append it all together
          forecastCard.append(forecastDayEl, hrLine, iconPara, tempPara, humidPara);
          $("#forecast-row").append(forecastCard);
        }
      });
      // end of forecast call
    });
  }
});
