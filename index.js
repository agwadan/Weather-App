console.log("Hello World");

const fetchData = async (event) => {
  event.preventDefault(); //------------------- Prevent Default Loading of the page.

  const location = document.getElementById('location-input').value;
  const weatherResultDiv = document.getElementById('weather-result');

  try {
    const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=ba82869c357c4038ab682813230108&q=${location}`);
    const data = await res.json();
    const filteredData = filterResponse(data);

    
      weatherResultDiv.innerHTML = 
     `
        <h2>${filteredData.location}</h2>
        <p>Temperature: ${filteredData.temperature}</p>
        <p>Humidity: ${filteredData.humidity}</p>
    `; 
  } catch (error) {
    console.error('Error:', error);
    weatherResultDiv.textContent = 'Failed to retrieve weather data';
  }
}

const filterResponse = (data) => {
  
  filteredData = {
    location: `${data.location.country} , ${data.location.name}`,
    temperature: data.current.feelslike_c,
    humidity: data.current.humidity
  }
  //console.log(filteredData);
  return filteredData;
}

document.getElementById('weather-form').addEventListener('submit',fetchData);