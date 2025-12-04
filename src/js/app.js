// NEA Weather API Integration
const NEA_API_URL = 'https://api.data.gov.sg/v1/environment/4-day-weather-forecast';

/**
 * Fetch weather data from NEA API
 */
async function fetchWeatherData() {
    try {
        const response = await fetch(NEA_API_URL);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        displayWeatherForecast(data);
        updateLastUpdatedTime(data.items[0].update_timestamp);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError('Unable to load weather data. Please try again later.');
    }
}

/**
 * Display weather forecast in a formatted grid
 */
function displayWeatherForecast(data) {
    const weatherContainer = document.getElementById('weather-container');
    const loadingElement = document.getElementById('loading');
    
    // Clear loading message
    loadingElement.style.display = 'none';
    weatherContainer.innerHTML = '';
    
    // Process forecast items (4-day forecast)
    const forecasts = data.items[0].forecasts;
    
    forecasts.forEach(forecast => {
        const date = new Date(forecast.date);
        const dateStr = date.toLocaleDateString('en-SG', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric'
        });
        
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.style.cssText = `
            background: linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%);
            border: 0.05cm solid #0277bd;
            border-radius: 0.25cm;
            padding: 1cm;
            text-align: center;
            box-shadow: 0 0.2cm 0.5cm rgba(0,0,0,0.1);
        `;
        
        const forecastText = forecast.forecast;
        const icon = getWeatherIcon(forecastText);
        
        card.innerHTML = `
            <h3 style="margin: 0 0 0.5cm 0; color: #00796b;">${dateStr}</h3>
            <div style="font-size: 2em; margin: 0.5cm 0;">${icon}</div>
            <p style="margin: 0.5cm 0; color: #004d40; font-weight: bold;">${forecastText}</p>
            <div style="border-top: 0.05cm solid #0277bd; padding-top: 0.5cm; margin-top: 0.5cm;">
                <p style="margin: 0.25cm 0; font-size: 0.9em;">
                    <strong>Humidity:</strong><br>
                    ${data.items[0].relative_humidity.find(h => h.date === forecast.date)?.afternoon || 'N/A'}%
                </p>
            </div>
        `;
        
        weatherContainer.appendChild(card);
    });
}

/**
 * Return emoji icon based on weather condition
 */
function getWeatherIcon(forecastText) {
    const text = forecastText.toLowerCase();
    
    if (text.includes('rain')) return '🌧️';
    if (text.includes('thunderstorm') || text.includes('lightning')) return '⛈️';
    if (text.includes('cloudy') || text.includes('overcast')) return '☁️';
    if (text.includes('fair') || text.includes('clear')) return '☀️';
    if (text.includes('windy')) return '💨';
    if (text.includes('haze')) return '🌫️';
    
    return '🌤️'; // Default
}

/**
 * Update the last updated timestamp
 */
function updateLastUpdatedTime(timestamp) {
    const lastUpdated = document.getElementById('last-updated');
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString('en-SG', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    const dateStr = date.toLocaleDateString('en-SG');
    
    lastUpdated.textContent = `Last updated: ${dateStr} at ${timeStr}`;
}

/**
 * Display error message
 */
function showError(message) {
    const errorElement = document.getElementById('weather-error');
    const loadingElement = document.getElementById('loading');
    
    loadingElement.style.display = 'none';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Initialize weather data on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    fetchWeatherData();
    
    // Refresh weather every 30 minutes
    setInterval(fetchWeatherData, 30 * 60 * 1000);
});