$(function () {
  const numberOfDaysToForecast = 5;
  var searchHistoryArray = [];
  const apiKey = "593c0385215d05c9409439d0b1361f3e";
  const inputField = $("#city-input");
  var cityName;
  var todaysDate = moment().format("D MMMM YYYY");
  var inputSwitch;
  var listCity;
  if (localStorage.getItem("Weather search history")) {
    var arrayFromStorage = localStorage
      .getItem("Weather search history")
      .split(",");
  } else {
    var arrayFromStorage;
  }

  //Click listeners
  // ===========================================================================

  //Listen to search button
  $("#search-btn").on("click", function () {
    event.preventDefault();

    if (inputField.val() === "") {
      //if blank, do nothing
      return;
    } else {
      inputSwitch = true;
      showWeather();
    }
  });

  //listen to the items in the search history sidebar
  $(document).on("click", ".list-group-item", function () {
    inputSwitch = false;
    listCity = $(this).text();
    showWeather();
  });
  // ===========================================================================

  function onLoad() {
    $("#search-history-items").empty();

    //if there is a search history in storage, display it
    if (arrayFromStorage) {
      searchHistoryArray = arrayFromStorage;
    }

    for (let i = 0; i < searchHistoryArray.length; i++) {
      var aSearchTerm = $("<li>").text(searchHistoryArray[i]);
      aSearchTerm.addClass("list-group-item");
      $("#search-history-items").prepend(aSearchTerm);
    }
  }
  onLoad();

  function showWeather() {
    event.preventDefault();

    // retrieves a search term from either the search bar or one of the previous search history items, depending on what the user clicked. This is used in the query URL
    if (inputSwitch) {
      cityName = inputField.val();
    } else {
      cityName = listCity;
    }

    $("#header-row").empty();
    $("#current-weather-data").empty();
    $("#forecast-row").empty();

    var currentWeatherQueryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&units=imperial&appid=" +
      apiKey;

    //API Calls begin
    //=========================================================================
    $.ajax({
      url: currentWeatherQueryURL,
      method: "GET",
    }).then(function (response) {
      //Change the cityName from whatever the user typed in to what the API returns as the "name"
      cityName = response.name;
      //VALIDATION CHECK: Check if city name is valid =======================
      if (response) {
        if (searchHistoryArray.includes(cityName) === false) {
          //if city name is not present in the array
          populateSearchBar();
        }
      } else {
        //TODO: no alert appears, idk if possible
        alert("not a valid city name");
      }

      //If validation is ok, continue. ========================================

      //Display header showing City, Date, and Icon
      cityNameAndDate = $("<h4>").text(response.name + " (" + todaysDate + ")");
      currentIconEl = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png"
      );
      $("#header-row").append(cityNameAndDate, currentIconEl);

      //Display weather data for the present moment
      currentTempEl = $("<p>").text(
        "Temperature: " + Math.round(response.main.temp) + " °F"
      );
      currentHumidityEl = $("<p>").text(
        "Humidity: " + response.main.humidity + "%"
      );
      currentWindEl = $("<p>").text(
        "Wind speed: " + Math.round(response.wind.speed) + " MPH"
      );
      //append them all together
      $("#current-weather-data").append(
        currentTempEl,
        currentHumidityEl,
        currentWindEl
      );

      //Grabbing variables with which to call for the UV index
      var latitude = response.coord.lat;
      var longitude = response.coord.lon;

      //current UV API Call
      var currentUVQueryURL =
        "https://api.openweathermap.org/data/2.5/uvi?appid=" +
        apiKey +
        "&lat=" +
        latitude +
        "&lon=" +
        longitude;

      $.ajax({
        url: currentUVQueryURL,
        method: "GET",
      }).then(function (response) {
        $("#forecast-title").text("5-day Forecast");

        currentUVLabel = $("<span>").text("UV Index: ");
        currentUVBadge = $("<span>").text(response.value);
        console.log(response.value);
        //apply UV colors
        if (response.value < 3) {
          // green
          currentUVBadge.addClass("uv-low");
        } else if (response.value >= 3 && response.value < 6) {
          //yellow
          currentUVBadge.addClass("uv-med");
        } else if (response.value >= 6 && response.value < 8) {
          //orange
          currentUVBadge.addClass("uv-high");
        } else if (response.value >= 8 && response.value <=10) {
          //red
          currentUVBadge.addClass("uv-very-high");
        } else {
          //purple
          currentUVBadge.addClass("uv-extreme");
        }

        $("#current-weather-data").append(currentUVLabel, currentUVBadge);

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

      $.ajax({
        url: forecastQueryURL,
        method: "GET",
      }).then(function (response) {
        //Loop to create forecast cards. See HTML file for a reference of how this looks when built. (the loops tarts on index 1 because 0 is today and we actually want to start with tomorrow)
        for (let i = 1; i < numberOfDaysToForecast + 1; i++) {
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
          var tempPara = $("<p>").text(
            "Temp: " + Math.round(response.daily[i].temp.day) + " °F"
          );

          //create p to hold humidity
          var humidPara = $("<p>").text(
            "Humidity: " + response.daily[i].humidity + "%"
          );

          //append it all together
          forecastCard.append(
            forecastDayEl,
            hrLine,
            iconPara,
            tempPara,
            humidPara
          );
          $("#forecast-row").append(forecastCard);
        }
      });
      // end of forecast call
    });
  }
  function populateSearchBar() {
    $("#search-history-items").empty();

    searchHistoryArray.push(cityName);
    console.log("searchHistoryArray: " + searchHistoryArray);
    localStorage.setItem("Weather search history", searchHistoryArray);

    for (let i = 0; i < searchHistoryArray.length; i++) {
      var aSearchTerm = $("<li>").text(searchHistoryArray[i]);
      aSearchTerm.addClass("list-group-item");
      $("#search-history-items").prepend(aSearchTerm);
    }
  }
});
