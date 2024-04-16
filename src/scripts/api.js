// weather data 
const apiKey = '36783e67c693e40318a73ec3be962cfb';
const url = 'http://api.openweathermap.org/data/2.5/forecast?id=1489425&appid='+apiKey;
fetch(url)
.then((response) => response.json())
.then((json) => console.log(json));

// const stationId = 'FLZ017';
// const apiUrl = `https://api.weather.gov/stations/${stationId}/observations/latest`;

// const headers = new Headers({
//   'User-Agent': 'EduApp/1.0', 
//   'Accept': 'application/ld+json'
//  });
 

// fetch(apiUrl, {headers})
//  .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//  })
//  .then(data => {
//     console.log(data);
//     // Here you can access the data you need, for example:
//     console.log(`Temperature: ${data.properties.temperature.value}`);
//     console.log(`Wind Speed: ${data.properties.windSpeed.value}`);
//  })
//  .catch(error => {
//     console.error('There was a problem with your fetch operation:', error);
//  });
