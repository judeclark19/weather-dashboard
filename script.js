$(function(){

    const apiKey = "593c0385215d05c9409439d0b1361f3e";
    var cityName = "Atlanta"

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +cityName+ "&appid="+apiKey

    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

    console.log(queryURL)

})