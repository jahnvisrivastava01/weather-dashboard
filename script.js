const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

function updateDate() {
    const today = new Date();

    document.getElementById("date").textContent =
        today.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

updateDate();

async function getWeather(city) {
    try {

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("City not found");
            return;
        }

        const location = geoData.results[0];

        const lat = location.latitude;
        const lon = location.longitude;

        document.getElementById("city").textContent =
            location.name;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        document.getElementById("temperature").textContent =
            `${Math.round(weatherData.current.temperature_2m)}°C`;

        document.getElementById("humidity").textContent =
            `${weatherData.current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${weatherData.current.wind_speed_10m} km/h`;

        document.getElementById("pressure").textContent =
            `${weatherData.current.pressure_msl} hPa`;

        document.getElementById("visibility").textContent =
            "Good";

        const code = weatherData.current.weather_code;

        let condition = "Sunny";
        let icon = "☀️";

        if (code >= 1 && code <= 3) {
            condition = "Cloudy";
            icon = "☁️";
        }

        if (code >= 51 && code <= 67) {
            condition = "Rainy";
            icon = "🌧️";
        }

        if (code >= 71 && code <= 77) {
            condition = "Snow";
            icon = "❄️";
        }

        if (code >= 95) {
            condition = "Thunderstorm";
            icon = "⛈️";
        }

        document.getElementById("condition").textContent =
            condition;

       

        if (condition === "Rainy") {

            document.body.style.background =
                "linear-gradient(135deg,#4b6cb7,#182848)";

        }
        else if (condition === "Cloudy") {

            document.body.style.background =
                "linear-gradient(135deg,#757f9a,#d7dde8)";

        }
        else if (condition === "Thunderstorm") {

            document.body.style.background =
                "linear-gradient(135deg,#232526,#414345)";

        }
        else if (condition === "Snow") {

            document.body.style.background =
                "linear-gradient(135deg,#83a4d4,#b6fbff)";

        }
        else {

            document.body.style.background =
                "linear-gradient(135deg,#4facfe,#00f2fe)";

        }

        const weatherIcon =
            document.getElementById("weatherIcon");

        if (condition === "Cloudy") {

            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/414/414825.png";

        }
        else if (condition === "Rainy") {

            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/1163/1163657.png";

        }
        else if (condition === "Snow") {

            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/642/642102.png";

        }
        else if (condition === "Thunderstorm") {

            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/1146/1146860.png";

        }
        else {

            weatherIcon.src =
                "https://cdn-icons-png.flaticon.com/512/869/869869.png";

        }

        const forecastContainer =
            document.getElementById("forecastContainer");

        forecastContainer.innerHTML = "";

        const dates = weatherData.daily.time;
        const maxTemps = weatherData.daily.temperature_2m_max;
        const minTemps = weatherData.daily.temperature_2m_min;

        for (let i = 0; i < 5; i++) {

            const dayName =
                new Date(dates[i]).toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                );

            const card =
                document.createElement("div");

            card.classList.add("forecast-card");

            card.innerHTML = `
                <p>${dayName}</p>
                <h2>${icon}</h2>
                <h4>${Math.round(maxTemps[i])}°C</h4>
                <small>${Math.round(minTemps[i])}°C</small>
            `;

            forecastContainer.appendChild(card);
        }

    } catch (error) {

        console.error(error);
        alert("Unable to fetch weather data.");

    }
}

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
    }

});

cityInput.addEventListener("keypress", (e) => {

    if (e.key === "Enter") {

        const city = cityInput.value.trim();

        if (city) {
            getWeather(city);
        }

    }

});



locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            const response = await fetch(
                `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}`
            );

            const data = await response.json();

            if (data.results && data.results.length > 0) {

                getWeather(data.results[0].name);

            }

        },

        () => {

            alert("Location permission denied");

        }

    );

});

getWeather("Mumbai");
