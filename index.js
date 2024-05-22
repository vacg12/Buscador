const searchInput = document.querySelector('#search');
const container = document.querySelector('#container');
const formContainer = document.querySelector('.form-container');
const informacion = document.querySelector('#info');
const formulario = document.querySelector('#form');
const infoMessage = document.querySelector('.info');
const infoClimaPais = document.querySelector('.infoClimaPais')

// Los paises descargados desde la api se guardan en el array de countries
// La api deberia pedirse solo una vez
// Usar este array para crear el filtrado
let countries = [];
let weather = [];
// Funcion que pide todos los paises
const getCountries = async () => {
  // Llamo a la API Rest Countries
 try {
  const Api = await fetch('https://restcountries.com/v3.1/all');
   // Transformo la respuesta a JSON
  const allCountries = await Api.json();
  // Guardo el array de los paises recibido dentro de contries
  countries = allCountries;
 } catch (error) {
  console.log(error);
 }
}
getCountries();

//Funcion para el tiempo

const getWeather = async (lat, lon) => {
  try {
    const ApiTiempo = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a6872a60263d097b8a8e84d634a00250&units=metric&lang=es`);
    const tiempo = await ApiTiempo.json();
    weather = tiempo;
    return weather
  } catch (error) {
    console.log(error);
  }
}
// hacer que funcione
searchInput.addEventListener('input', async e => {
  e.preventDefault();
  const searchCountries = countries.filter(pais => pais.name.common.toLowerCase().startsWith(searchInput.value.toLowerCase()));
  container.innerHTML = "";
  console.log(searchCountries);

  if (searchInput.value.length === 0) {
    infoMessage.style.display = 'none'; // Ocultar mensaje si no hay letras
  } else if (searchCountries.length > 10) {
    infoMessage.style.display = 'block'; // Mostrar mensaje si hay más de 10 países
  } else {
    if (searchCountries.length > 1 && searchCountries.length < 10 || searchCountries.length === 1) {
      infoMessage.style.display = 'none'; // Ocultar mensaje
      container.innerHTML = `
        <div class="loader"></div>
        `;
      // Mostrar resultados de búsqueda múltiple (función innerPais)
      innerPais(searchCountries);

      // Mostrar información de un solo país
      if (searchCountries.length === 1) {
        const lat = searchCountries[0].latlng[0];
        const lon = searchCountries[0].latlng[1];
        container.innerHTML = `
        <div class="loader"></div>
        `;
        const climaApi = await getWeather(lat, lon);
        console.log(climaApi);

        const infoPais1HTML = `
          <ul class='infoClimaPais'>
            <li> <img src="${searchCountries[0].flags.svg}" alt="flag"> </li>
            <li> <p> Pais: <span class="info-pais" id="name">${searchCountries[0].name.common}</span></p> </li>
            <li> <p> Capital: <span class="info-pais" id="capital">${searchCountries[0].capital}</span></p> </li>
            <li> <p> Habitantes: <span class="info-pais" id="habitantes">${searchCountries[0].population.toLocaleString()}</span></p> </li>
            <li> <p> Región: <span class="info-pais" id="region">${searchCountries[0].region}</span></p> </li>
            <li> <p> Zona Horaria: <span class="info-pais" id="region">${searchCountries[0].timezones[0]}</span></p> </li>
            <li> <p> Clima: <img class="imagen" src="https://openweathermap.org/img/wn/${climaApi.weather[0].icon}@2x.png" <span class="info-pais" id="region">${climaApi.weather[0].description}</span></p> </li>
            <li> <p> Temperatura: <span class="info-pais" id="region">  ${climaApi.main.temp}°C</span></p> </li>
          </ul>
        `;

        container.innerHTML = infoPais1HTML; // Mostrar información del único país encontrado
      }
      
    } else {
      if (searchCountries.length === 0){
        container.innerHTML = `
        <a class="a"> No se ha encontrado ningun pais con ese nombre </a>
        `;
      }
    }
  }
});

// Aqui se especifica que quiero sacar de la API
const infoPais1 = countries => countries.map (pais =>
`<ul>
<li> <img src="${pais.flags.svg}" alt="flag"> </li>
<li> <p> Pais: <span class="info-pais" id="name">${pais.name.common}</span></p> </li>
</ul>
`
)

//Luego se guarda en constantes para despues llamarlas en el if
function innerPais (countries){
  const tarjeta1 = infoPais1(countries)
  container.innerHTML= tarjeta1
}





