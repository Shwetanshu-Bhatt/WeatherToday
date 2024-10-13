// Function to fetch and display weather data
document.getElementById("search-button").addEventListener("click", function() {
    const cityName = document.getElementById("city-input").value;
    fetchWeather(cityName);
});

function fetchWeather(city) {
    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error); // Display error message from API
                return;
            }
            displayWeather(data);
            saveFavorite(city);
            displayFavorites();
        })
        .catch(error => {
            alert('Error fetching weather data: ' + error);
        });
}

function displayWeather(data) {
    const weatherInfo = document.getElementById("weather-info");
    const temperature = isMetric ? data.temperature : (data.temperature * 9/5) + 32;
    const unit = isMetric ? '°C' : '°F';
    const windSpeed = isMetric ? data.wind_speed : data.wind_speed * 2.237; // Convert m/s to mph
    
    weatherInfo.innerHTML = `
        <h2>Weather in ${data.city}</h2>
        <p>Temperature: ${temperature.toFixed(2)}${unit}</p>
        <p>Humidity: ${data.humidity}%</p>
        <p>Wind Speed: ${windSpeed.toFixed(2)} ${isMetric ? 'm/s' : 'mph'}</p>
        <p>Condition: ${data.condition}</p>
    `;
    
    updateBackground(data.condition);
}

let isMetric = true; // Flag for unit type
document.getElementById("toggle-units").addEventListener("click", function() {
    isMetric = !isMetric;
    this.textContent = isMetric ? "Switch to Imperial" : "Switch to Metric";
    const cityName = document.getElementById("city-input").value;
    fetchWeather(cityName); // Re-fetch weather with updated units
});

function saveFavorite(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

function displayFavorites() {
    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = '';
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.addEventListener('click', () => fetchWeather(city)); // Fetch weather for clicked favorite
        favoritesList.appendChild(li);
    });
}

function updateBackground(condition) {
    const body = document.body;
    if (condition.includes('rain')) {
        body.style.backgroundImage = "images/rainy.jpg"; 
    } else if (condition.includes('sun')) {
        body.style.backgroundImage = "images/sunny.jpeg";
    } else {
        body.style.backgroundImage = "images/normal.jpeg";
    }
}

document.addEventListener("DOMContentLoaded", displayFavorites);
