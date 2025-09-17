import { useState, useEffect, use } from 'react'
import countryService from './services/countries' 
import weatherService from './services/weather'
{/*db.json from https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c*/}
{/*use db.json server to get weather icons*/}

const Countries = (props) => {
  const maat = props.countries
                          .filter((country) => country.toLowerCase()
                          .includes(props.search.toLowerCase()))

  if (maat.length > 10) {
    return (
      <p>too many matches, give a more specific search.</p>
    )
  }
  else if (maat.length === 1) {
    return (
      <Country countryName={maat[0]} />
    )
  }
  return (
    <ul>
      {maat.map(country => 
        <li key={country}>
          {country} <button onClick={props.show} value={country}>Show</button>
        </li>
    )}
    </ul>
  )
}

const Country = ({ countryName }) => {
  const [country, setCountry] = useState(null)
  const [weatherData, setWeather] = useState(null)
  useEffect(() => {
    countryService.getCountry(countryName)
                  .then(response => {
                    console.log("promise fullfilled")
                    setCountry(response)
                  })
  }, [])

  useEffect(() => {
    if (country) {
      console.log(country)
      weatherService.getWeather(country.capitalInfo.latlng)
                  .then(response => {
                    console.log("promise fullfilled")
                    setWeather(response)
                   })
    }
  }, [country])
  
  if (country && weatherData) {
    return (
      <div>
        <h1>
          {countryName}
        </h1>
        <p>
          Capital: {country.capital}<br/>
          Area: {country.area}
        </p>
        <h2>
          languanges
        </h2>
        <ul>
          {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
        </ul>
        <img src={country.flags.svg} width="15%" alt={country.flags.alt}/>
        <h2>
        Weather in {country.capital}
        </h2>
        <Weather weatherData={weatherData} />
      </div>
    )
  }
  return (
    <div>
    </div>
  )
  
}

const Weather = ({ weatherData }) => {                          
  console.log("comp", weatherData)
  const [icon, setIcon] = useState(null)
  useEffect(() => {
    console.log("effect")
    weatherService.getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day === 1 ? "day" : "night")
                  .then(response => {
                    console.log("promise fullfilled", response)
                    setIcon(response)
                  })
  }, [])
  if (icon) {
    return (
      <div>
          Temperature: {weatherData.current.temperature_2m} Celcius <br/>
          {icon["description"]}<br />
          <img src={icon["image"]} /> <br />
          Wind speed: {weatherData.current.wind_speed_10m} m/s
      </div>
  )
  }
  return (
      <div>
          Temperature: {weatherData.current.temperature_2m} Celcius <br/>
          Wind speed: {weatherData.current.wind_speed_10m} m/s
      </div>
  )
}


const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [newName, setNewName] =useState("")

  useEffect(() => {
    console.log("effect")
    countryService.getAllNames()
                  .then(response => {
                    setAllCountries(response)
                  })
  }, [])
 

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  } 

  return(
    <>
    <form>
    search for a country: <input value={newName} onChange={handleNameChange} />
    </form>
    <Countries countries={allCountries} search={newName} show={handleNameChange}/>
    </>
  )
}

export default App
