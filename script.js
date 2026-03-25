/*const { Container } = require("postcss");
const { createElement } = require("react");
*/
const apiKey = '1fe1702c032c42f2859a83b090a479b6';

const searchFormEl = document.querySelector('#search-form');
const searchInputEl = document.querySelector('#city-input');
const loaderEl = document.querySelector('#loader');
const errorContainerEl = document.querySelector('#error-container');
const tempEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windEl = document.querySelector('#wind-speed');
const cityEl = document.querySelector('#city-name-and-date');
const forecastContainerEl = document.querySelector('#forecast-container');
const historyContainerEl = document.querySelector('#history-container');
loaderEl.classList.add('hidden');
const displayCurrentWeather = (data) => {
    const currentDate = new Date().toLocaleDateString();
    cityEl.textContent = `${data.name} (${currentDate})`;
    tempEl.textContent = `Temperature: ${Math.round(data.main.temp)} °C`;
    humidityEl.textContent = `Humidity: ${data.main.humidity} %`;
    windEl.textContent = `Wind Speed: ${data.wind.speed} m/s`;
};
const displayForecast = (forecastList) => {
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

searchFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = searchInputEl.value.trim();
    if (city) {
        fetchWeather(city);
        searchInputEl.value = '';
    } else {
        alert("enter a city name!!!");
        return;
    }


    console.log("form submitted!!! and default action prevented!!!");
});
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
    historyContainerEl.innerHTML = '';
    for (const city of history) {
        const historybtn = document.createElement('button');
        historybtn.textContent = city;
        historybtn.classList.add('history-btn');
        historybtn.setAttribute('data-city', city);
        historyContainerEl.append(historybtn);
        historybtn.addEventListener('click', () => fetchWeather(city));
    }
}
/* 
@param { String } */
function saveCityToHistory(city) {
    const historyString = localStorage.getItem('weatherHistory' || '[]');
    let history = historyString ? JSON.parse(historyString) : [];
    history = history.filter(existingCity => existingCity.toLowerCase() !== city.toLowerCase());
    history.unshift(city);
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
}



const fetchWeather = async (city) => {
    try {
        errorContainerEl.classList.add('hidden');
        forecastContainerEl.innerHTML = '';
        tempEl.innerHTML = '';
        cityEl.innerHTML = '';
        humidityEl.innerHTML = '';
        windEl.innerHTML = '';
        loaderEl.classList.remove('hidden');
        console.log("loader off ho gya!!!!");
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
        saveCityToHistory(city);
        renderHistory();

    } catch (error) {
        console.error('Error fetching weather data:', error);
        console.log('Please check the city name or try again later.');
        errorContainerEl.textContent = "choose the right city,try again!!!";
        errorContainerEl.classList.remove('hidden');
    } finally {
        loaderEl.classList.add('hidden');
    };

    /* try {
         const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
         const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
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
         errorContainerEl.textContent = 'Sorry,the city could not be found, please try again.';
         loaderEl.classList.remove('hidden');
 
     } finally {
         loaderEl.classList.add('hidden');
     }*/
};