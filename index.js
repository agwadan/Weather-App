console.log("Weather App");
let isCelsius = true;

let currentLocation = 'Kampala';

window.onload = () => {
  fetchData(currentLocation);
}

const fetchData = async (location, event) => {
  
  if(event) event.preventDefault(); //------------------- Prevent Default Loading of the page.

  const weatherResultDiv = document.getElementById('weather-result');

  try {
    const resCurrent = await fetch(`https://api.weatherapi.com/v1/current.json?key=ba82869c357c4038ab682813230108&q=${location}`);
    const dataCurrent = await resCurrent.json();

    
    const resForecast = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=ba82869c357c4038ab682813230108&q=${location}&days=3`);
    const dataForecast = await resForecast.json();
    

    const filteredData = filterResponse(dataCurrent, dataForecast);

    /* Loop through the different forecast days and store it in a variable and later append it to the weatherResultDiv */
    const forecastHTML = filteredData.forecast.map(forecast => `
    
    <div class='forecast'>
      <h3>${forecast.date}</h3>
      <p>${forecast.condition}</p>
      <p>${isCelsius ? forecast.temperatureC : forecast.temperatureF}</p>
      <img src='${forecast.imgUrl}'/>
    </div>
    `).join('');
    
      weatherResultDiv.innerHTML = 
     `
        <h2>${filteredData.location} <br> ${new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
        <p>Temperature: ${ isCelsius ? filteredData.temperatureC : filteredData.temperatureF}</p>
        <p>Condition: ${filteredData.condition}</p>
        <img src= '${filteredData.imgUrl}'/>
        <h2>Forecast</h2>
        <div class='forecast-container'>
          ${forecastHTML}
        </div>
    `; 

  } catch (error) {
    console.error('Error:', error);
    weatherResultDiv.textContent = 'Unfortunately, we don\'t have your location';
  }
}


/* This function filters all from all the data in the response from the api, and returns only what is needed
___________________________________________________________________________________________________________ */

const filterResponse = (dataCurrent, dataForecast) => {
  
  filteredData = {
    location: `${dataCurrent.location.country} , ${dataCurrent.location.name}`,
    temperatureC: `${ dataCurrent.current.feelslike_c} <sup>o</sup>C`,
    temperatureF: `${ dataCurrent.current.feelslike_f} <sup>o</sup>F`,
    condition: dataCurrent.current.condition.text,
    imgUrl: dataCurrent.current.condition.icon,
    forecast: dataForecast.forecast.forecastday.map(day => ({ //-------------- Looping through the forecasted days to generate the info we need.
      date:  new Date(day.date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      condition: day.day.condition.text,
      temperatureC: `${day.day.avgtemp_c}<sup>o</sup>C`,
      temperatureF: `${day.day.avgtemp_f}<sup>o</sup>F`,
      imgUrl: day.day.condition.icon
    }))
  }

  //console.log(filteredData);
  return filteredData;
}

document.getElementById('weather-form').addEventListener('submit', event => {
  currentLocation = document.getElementById('location-input').value;
  fetchData(currentLocation, event);
});

document.getElementById('toggle').addEventListener('click', () => {
  isCelsius = !isCelsius; //-------------------------------------------------- toggle between true and false
  fetchData(currentLocation); //---------------------------------------------- fetch and display the data again with the new temperature unit
});