import { useState, useEffect } from 'react'
import './App.css'
import {
  getLocationFromIPInfo,
  getCurrentOpenWeather,
  GetHourlyForecast,
  GetDailyForecast,
} from './action'


function Weather() {

  const date = new Date()
  const API_KEY = import.meta.env.VITE_WEATHER_API


  const [hourlyForecast, setHourlyForecast] = useState([])
  const [dailyForecast, setDailyForecast] = useState([])
  const [currentLocation, setCurrentLocation] = useState({})
  const [cityName, setCityName] = useState('')
  const [showError, setShowError] = useState(false)
  const [weatherData, setWeatherData] = useState({})




  const handleSearch = async () => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`)
      if (response.status == 404) {
        setShowError(true)
        setTimeout(() => {
          setShowError(false)
        }, 2000);
        console.warn(`You have entered a wrong city name '${cityName}'`)
      }
      const data = await response.json()
      setWeatherData({
        city: data.name,
        country: data.sys.country,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        temp: data.main.temp,
        visibility: data.visibility,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        feels_like: data.main.feels_like,
        condition: data.weather[0].main,
        icon: data.weather[0].icon,
        wind_speed: data.wind.speed
      })
      setCurrentLocation({
        city: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      })
      setCityName('')
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {

    getLocationFromIPInfo(currentLocation, setCurrentLocation)
  }, [])

  async function GetUVIndex(currentLocation) {
    const res = await fetch(`https://currentuvindex.com/api/v1/uvi?latitude=${currentLocation.lat}&longitude=${currentLocation.lon}`)
    const data = await res.json()

    console.log(data)
  }

  useEffect(() => {
    // GetUVIndex(currentLocation)
    getCurrentOpenWeather(currentLocation, weatherData, setWeatherData)
    GetHourlyForecast(currentLocation, hourlyForecast, setHourlyForecast)
    GetDailyForecast(currentLocation, dailyForecast, setDailyForecast)

  }, [currentLocation])



  return (

    <div
      className='w-full text-white min-h-screen gradient-1 flex flex-col items-center justify-center'
    >
      <h1 className='text-4xl py-5 font-semibold'>Weather App</h1>

      {weatherData.length == 0 && hourlyForecast.length == 0 && dailyForecast.length == 0 ? (<div className='w-full h-100 md:w-4/5 px-5 py-10 blur-1 border-2 border-white  rounded-2xl flex flex-col justify-center items-center gap-6'>
        <p className='text-4xl text-center font-light bg-red-700 px-4 py-2 rounded-lg'>Loading Failed!!</p>
        <p className='text-2xl text-center'>Check your internet connection or try again later</p>
      </div>)
        : (
          <div className='w-full md:w-4/5 px-5 py-10 blur-1 border-2 border-white rounded-2xl flex flex-col lg:flex-row justify-center items-start gap-6'>
            {
              weatherData.length != 0 ? (
                <div className="w-full min-h-100 lg:w-1/2 flex flex-col justify-around items-center border-b-2 lg:border-0 lg:border-r-2 lg:pr-5">
                  <div className="w-full flex justify-center items-center mb-6 gap-0">
                    <input
                      type="text"
                      placeholder='Enter the city name'
                      className={`p-2 shadow-md  border ${showError ? 'border-red-800' : 'border-white'} border-r-0 rounded-l-xl focus:outline-none max-w-[70%]`}
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
                    />
                    <button
                      className={`p-2 rounded-r-xl shadow-lg border ${showError ? 'border-red-800' : 'border-white'}  max-w-[30%] cursor-pointer hover:bg-white/50`}
                      type='button'
                      onClick={handleSearch}
                    >
                      Search
                    </button>
                  </div>
                  {showError && (
                    <span className='text-red-800 text-sm'>
                      wrong input: {cityName}
                    </span>
                  )}


                  <div className='w-full flex flex-col justify-around items-center bg-opacity-50 rounded-xl p-4 py-8'>
                    <div className='flex flex-col items-center mb-4 gap-5'>
                      <h2 className='text-4xl flex justify-center items-center font-semibold'>
                        <span className='pr-5'>
                          {weatherData.city}, {weatherData.country}
                        </span>

                        <span className='border-l-2 pl-5'>
                          {(weatherData.temp - 273).toFixed(2)}°C
                        </span>
                      </h2>
                      <p>{date.toDateString()}</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                        alt="weather icon"
                        className='-mt-4 mb-4'
                      />
                    </div>
                    <ul className='w-full flex flex-col justify-center text-lg font-medium'>
                      <hr className='mb-2' />
                      <li className='mb-2'>Feels Like : {(weatherData.feels_like - 273).toFixed(2)}°C</li>
                      <hr className='mb-2' />
                      <li className='mb-2'>Humidity : {weatherData.humidity}%</li>
                      <hr className='mb-2' />
                      <li className='mb-2'>Pressure : {weatherData.pressure} hPa</li>
                      <hr className='mb-2' />
                      <li className='mb-2'>Wind Speed : {(weatherData.wind_speed * 3.6).toFixed(1)} km/h</li>
                      <hr className='mb-2' />
                      <li className='mb-2'>Visibility : {(weatherData.visibility / 1000).toFixed(1)} km</li>
                      <hr className='mb-2' />
                      <li className='mb-2'>Sunrise : {new Date(weatherData.sunrise * 1000).toLocaleTimeString('en-IN', { hour12: true })}</li>
                      <hr className='mb-2' />
                      <li className='mb-2'>Sunset : {new Date(weatherData.sunset * 1000).toLocaleTimeString('en-IN', { hour12: true })}</li>
                      <hr className='mb-2' />
                    </ul>
                  </div>

                </div>
              ) : (
                <p className=' '>Loading Failed!!</p>
              )
            }

            <div className='w-full min-h-100 lg:w-1/2 flex flex-col gap-10 justify-center items-center rounded-xl'>
              <div className='w-full flex flex-col justify-center items-center text-center'>
                <h3 className='text-2xl font-semibold mb-10'>Hourly Forecast</h3>
                {hourlyForecast && hourlyForecast.length > 0 ? (
                  <div className='w-full overflow-x-auto handle-scroll p-4  rounded-lg'>
                    <ul className='flex gap-4 whitespace-nowrap'>
                      {hourlyForecast.map((item, index) => (
                        <li key={index} className='flex flex-col justify-center items-center 
                        text-center blur-2 p-4 rounded-lg shadow-lg min-w-[120px]'>
                          <p className='font-semibold'>
                            {new Date(item.timestamp_local).toLocaleTimeString('en-IN', { hour12: true })}
                          </p>
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather.icon.slice(1,)}@2x.png`}
                            alt="weather icon"
                            className='w-10'
                          />
                          <p className='text-lg'>{item.temp}°C</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No hourly forecast available !</p>
                )}
              </div>

              <div className='w-full flex flex-col justify-center items-center text-center'>
                <h3 className='text-2xl font-semibold mb-10'>Daily Forecast</h3>
                {dailyForecast && dailyForecast.length > 0 ? (
                  <div className='w-full overflow-x-auto handle-scroll p-4  rounded-lg'>
                    <ul className='flex gap-4 whitespace-nowrap'>
                      {dailyForecast.map((item, index) => (
                        <li key={index} className='flex flex-col justify-center items-center
                         text-center blur-2 p-4 rounded-lg shadow-md min-w-[120px]'>
                          <p className='font-semibold'>
                            {`${date.toDateString() == new Date(item.valid_date).toDateString() ? 'Today'
                              : new Date(item.valid_date).toDateString().slice(0, -5)}`}</p>
                          <img
                            src={`https://openweathermap.org/img/wn/${item.weather.icon.slice(1,)}@2x.png`}
                            alt="weather icon"
                            className='w-10'
                          />
                          <p className='text-lg'>
                            {Math.floor(item.min_temp)}° / {Math.floor(item.max_temp)}°C
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>No daily forecast available !</p>
                )}
              </div>

            </div>
          </div>

        )}
    </div>
  )
}

export default Weather
