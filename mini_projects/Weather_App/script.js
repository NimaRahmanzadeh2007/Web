const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temp");
const status = document.getElementById("status");
const statusEmoji = document.getElementById("statusEmoji");
const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");

searchBtn.addEventListener("click", function () {

    const location = cityInput.value.trim();
    cityName.textContent = location.charAt(0).toUpperCase() + location.slice(1);

    getLocation(location);

});


async function getLocation(location) {

    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);

        if (!response.ok) {
            cityName.textContent = "-";
            throw new Error("Failed to fetch");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            cityName.textContent = "-";
            throw new Error("City not found");
        }

        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;

        await showWeather(latitude, longitude);
    }
    catch (error) {
        cityName.textContent = "-";
        window.alert(error.message);
    }
}

async function showWeather(latitude, longitude) {

    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code&timezone=auto`);

        if (!response.ok) {
            throw new Error("Failed to fetch");
        }

        const data = await response.json();

        temperature.textContent = data.current.temperature_2m + data.current_units.temperature_2m;
        wind.textContent = data.current.wind_speed_10m + " " + data.current_units.wind_speed_10m;
        humidity.textContent = data.current.relative_humidity_2m + data.current_units.relative_humidity_2m;

        const weatherCode = data.current.weather_code;

        getWeatherStatus(weatherCode);

    }
    catch (error) {
        window.alert(error.message);
    }

}

function getWeatherStatus(weatherCode) {

    if (weatherCode === 0) {

        statusEmoji.textContent = "☀️";
        status.textContent = "Clear sky";

    } else if (weatherCode <= 2) {

        statusEmoji.textContent = "⛅";
        status.textContent = "Partly cloudy";

    } else if (weatherCode === 3) {

        statusEmoji.textContent = "☁️";
        status.textContent = "Cloudy";

    } else if (weatherCode >= 51 && weatherCode <= 67) {

        statusEmoji.textContent = "🌧️";
        status.textContent = "Rain";

    } else if (weatherCode >= 71 && weatherCode <= 77) {

        statusEmoji.textContent = "❄️";
        status.textContent = "Snow";

    } else {

        statusEmoji.textContent = "🌡️";
        status.textContent = "Unknown";

    }

}