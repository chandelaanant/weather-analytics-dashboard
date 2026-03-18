const apiKey = '1fe1702c032c42f2859a83b090a479b6';

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#city-input');
const loaderEl = document.querySelector('#loader');
const tempEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windEl = document.querySelector('#wind-speed');
const cityEl = document.querySelector('#city-name-and-date');
const forecastContainerEl = document.querySelector('#forecast-container');

const displayCurrentWeather = (data) => {
    const currentDate = new Date().toLocaleDateString();
    cityEl.textContent = `${data.name} (${currentDate})`;
    tempEl.textContent = `Temperature: ${Math.round(data.main.temp)} °C`;
    humidityEl.textContent = `Humidity: ${data.main.humidity} %`;
    windEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;
};
const displayForecast = (forecastList) => {
    forecastContainerEl.innerHTML = '';
    for (let i = 0; i < forecastList.length; i += 8) {
        const dailyForecast = forecastList[i];
        const card = document.createElement('div');
        card.classList.add('forecast-card');
        console.log(card);
        const date = new Date(dailyForecast.dt_txt).toLocaleDateString();
        const dateEl = document.createElement('h3');
        dateEl.textContent = date;
        const iconCode = dailyForecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const iconEl = document.createElement('img');
        iconEl.setAttribute('src', iconUrl);
        iconEl.setAttribute('alt', dailyForecast.weather[0].description);
        const tempEl = document.createElement('p');
        tempEl.textContent = `Temp: ${Math.round(dailyForecast.main.temp)} C`;
        const humidityEl = document.createElement('p');
        humidityEl.textContent = `humidity: ${dailyForecast.main.humidity}%`;
        card.append(dateEl, iconEl, tempEl, humidityEl);
        forecastContainerEl.append(card);


    }
};

const fetchWeather = async (city) => {
    try {
        loaderEl.classList.remove('hidden');
        const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await fetch(cityUrl);
        if (!response.ok) {
            throw new Error(`city not found or api error: ${response.status} ${response.statusText}`);
        }
        const weatherData = await response.json();
        console.log('current Weather:', weatherData);


        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error(`error loading the response:${forecastResponse.status}`);
        }
        const forecastData = await forecastResponse.json();
        displayCurrentWeather(weatherData);
        displayForecast(forecastData.list);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        console.log('Please check the city name or try again later.');
    }
    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        const responses = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl),
        ]);

        for (const response of responses) {
            if (!response.ok) {
                throw new Error('City not found or API error.');
            }
        }
        const [currentWeather, forecast] = await Promise.all(
            responses.map(response => response.json())
        );

        displayCurrentWeather(currentWeather);
        displayForecast(forecast);

    } catch (error) {
        console.errror('Failed to fetch weather data:', error);
    }
};
searchFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = searchInputEl.value.trim();
    if (city) {
        fetchWeather(city);
        searchInputEl.value = ' ';
    } else {
        alert("enter a city name!!!");
        return;
    }


    console.log("form submitted!!! and default action prevented!!!");
})




// Additional functionality to update the DOM with fetched data can be added here.

