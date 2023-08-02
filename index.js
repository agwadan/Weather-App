console.log("Hello World");

const fetchData = async (event) => {
  event.preventDefault(); //------------------- Prevent Default Loading of the page.

  const location = document.getElementById('location-input').value;
  const weatherResultDiv = document.getElementById('weather-result');

  try {
    const resCurrent = await fetch(`http://api.weatherapi.com/v1/current.json?key=ba82869c357c4038ab682813230108&q=${location}`);
    const dataCurrent = await resCurrent.json();

    
    const resForecast = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=ba82869c357c4038ab682813230108&q=${location}&days=3`);
    const dataForecast = await resForecast.json();
    

    const filteredData = filterResponse(dataCurrent, dataForecast);


    console.log(filteredData);
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
        <p>Temperature: ${filteredData.temperature}</p>
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
    temperature: dataCurrent.current.feelslike_c,
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
        condition: dataForecast.forecast.forecastday[1].day.text,
        imgUrl: dataForecast.forecast.forecastday[1].day.condition.icon
      },
      {
        date: dataForecast.forecast.forecastday[2].date,
        condition: dataForecast.forecast.forecastday[2].day.text,
        imgUrl: dataForecast.forecast.forecastday[2].day.condition.icon
      }
      
    ]
  }
  //console.log(filteredData);
  return filteredData;
}

document.getElementById('weather-form').addEventListener('submit',fetchData);