const OPEN_WEATHER_API = import.meta.env.VITE_WEATHER_API;
const WEATHER_BIT_API = import.meta.env.VITE_WEATHERBIT_API;


const getLocationFromIPInfo = async (currentLocation, setCurrentLocation) => {
  try {
    const response = await fetch("https://ipinfo.io/json");
    const data = await response.json();

    if (data.loc) {
      const [lat, lon] = data.loc.split(",");
      const IPinfo = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        city: data.city,
        country: data.country,
      };
      setCurrentLocation({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        city: data.city,
        country: data.country,
      });
      // console.log(IPinfo);
      return;
    } else {
      console.warn("Unable to get current coordinates: IPInfo");
    }
  } catch (error) {
    console.warn("IPInfo geolocation error:", error);
  }
};




async function getCurrentOpenWeather(
  currentLocation,
  weatherData,
  setWeatherData
) {
  if (currentLocation.lat && currentLocation.lon) {try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${currentLocation.lat}&lon=${currentLocation.lon}&appid=${OPEN_WEATHER_API}`
    );
    const data = await response.json();
    setWeatherData({
      city: data.name, country: data.sys.country,
      sunrise: data.sys.sunrise, sunset: data.sys.sunset,
      temp_min: data.main.temp_min, temp_max: data.main.temp_max,
      temp: data.main.temp, visibility: data.visibility,
      humidity: data.main.humidity, pressure: data.main.pressure,
      feels_like: data.main.feels_like, condition: data.weather[0].main,
      icon: data.weather[0].icon, wind_speed: data.wind.speed,
    });
    // console.log(data)
    return;
  } catch (error) { 
    console.warn("OpenWeatherMap error:", error);
  }} else {
    console.warn("Current location not found")
  }}



async function getCurrentWeatherBit(
  currentLocation,
  weatherData,
  setWeatherData
) {
  try {
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/current?lat=${currentLocation.lat}&lon=${currentLocation.lon}&key=${WEATHER_BIT_API}`
    );

    const incoded = await response.json();
    const data = incoded.data[0];
    setWeatherData({
      city: data.city_name,
      country: data.country_code,
      sunrise: data.sunrise,
      sunset: data.sunset,
      temp_min: null,
      temp_max: null,
      temp: data.temp,
      visibility: null,
      humidity: null,
      pressure: data.pres,
      feels_like: null,
      weather: data.weather,
      wind_speed: data.wind_spd,
      uv: data.uv,
      aqi: data.aqi,
    });
    return data;
    // console.log(data)
  } catch (error) {
    console.warn("WeatherBit error:", error);
  }
}

async function GetHourlyForecast(
  currentLocation,
  hourlyForecast,
  setHourlyForecast
) {
  if (currentLocation.lat && currentLocation.lon){
    try {
    const responsey = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${currentLocation.lat}&lon=${currentLocation.lon}&key=${WEATHER_BIT_API}`
    );
    const data = await responsey.json();
    console.log(data)
    setHourlyForecast(
      data.data.filter(
        (item) =>
          new Date(item.timestamp_local).toDateString() ==
          new Date().toDateString()
      )
    );
  } catch (error) {
    console.warn("error while trying to get hourly forecast:", error)
  }} else {
    console.warn("Current location not found")
  }}


async function GetDailyForecast(
  currentLocation,
  dailyForecast,
  setDailyForecast
) {
  if (currentLocation.lat && currentLocation.lon){
  try {
    const responsez = await fetch(
      `https://api.weatherbit.io/v2.0/forecast/daily?lat=${currentLocation.lat}&lon=${currentLocation.lon}&key=${WEATHER_BIT_API}`
    );
    const data = await responsez.json();
    console.log(data)
    setDailyForecast(data.data.slice(0, 7));
  } catch (error) {
    console.warn("error while trying to get daily forecast:", error);
  }
  } else {
    console.warn("Current location not found")
  }}

export {
  getLocationFromIPInfo,
  getCurrentOpenWeather,
  getCurrentWeatherBit,
  GetHourlyForecast,
  GetDailyForecast,
};
