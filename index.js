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
    const resCurrent = await fetch(`http://api.weatherapi.com/v1/current.json?key=ba82869c357c4038ab682813230108&q=${location}`);
    const dataCurrent = await resCurrent.json();

    
    const resForecast = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ba82869c357c4038ab682813230108&q=${location}&days=3`);
    const dataForecast = await resForecast.json();
    

    const filteredData = filterResponse(dataCurrent, dataForecast);

    /* Loop through the different forecast days and store it in a variable and later append it to the weatherResultDiv */
    const forecastHTML = filteredData.forecast.map(forecast => `
    <div class='forecast'>
      <h3>Date: ${forecast.date}</h3>
      <p>${forecast.condition}</p>
      <img src='${forecast.imgUrl}'/>
    </div>
    `).join('');
    
      weatherResultDiv.innerHTML = 
     `
        <h2>${filteredData.location}</h2>
        <p>Temperature: ${ isCelsius ? filteredData.temperatureC : filteredData.temperatureF}</p>
        <p>Condition: ${filteredData.condition}</p>
        <img src= '${filteredData.imgUrl}'/>

        ${forecastHTML}
    `; 

  } catch (error) {
    console.error('Error:', error);
    weatherResultDiv.textContent = 'Failed to retrieve weather data';
  }
}

const filterResponse = (dataCurrent, dataForecast) => {
  
  filteredData = {
    location: `${dataCurrent.location.country} , ${dataCurrent.location.name}`,
    temperatureC: `${ dataCurrent.current.feelslike_c} <sup>o</sup>C`,
    temperatureF: `${ dataCurrent.current.feelslike_f} <sup>o</sup>F`,
    condition: dataCurrent.current.condition.text,
    imgUrl: dataCurrent.current.condition.icon,
    forecast: [
      {
        date: dataForecast.forecast.forecastday[0].date,
        condition: dataForecast.forecast.forecastday[0].day.condition.text,
        imgUrl: dataForecast.forecast.forecastday[0].day.condition.icon
      },
      {
        date: dataForecast.forecast.forecastday[1].date,
        condition: dataForecast.forecast.forecastday[1].day.condition.text,
        imgUrl: dataForecast.forecast.forecastday[1].day.condition.icon
      },
      {
        date: dataForecast.forecast.forecastday[2].date,
        condition: dataForecast.forecast.forecastday[2].day.condition.text,
        imgUrl: dataForecast.forecast.forecastday[2].day.condition.icon
      }
    ]
  }
  //console.log(filteredData);
  return filteredData;
}

document.getElementById('weather-form').addEventListener('submit', event => {
  const location = document.getElementById('location-input').value;
  fetchData(location, event);
});

document.getElementById('toggle').addEventListener('click', () => {
  isCelsius = !isCelsius; //-------------------------------------------------- toggle between true and false
  fetchData(currentLocation); //---------------------------------------------- fetch and display the data again with the new temperature unit
});