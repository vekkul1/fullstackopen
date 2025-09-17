import axios from "axios"
import { useEffect } from "react"

const getWeather = ([ lat, lang ]) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lang}&current=temperature_2m,weather_code,is_day,wind_speed_10m&timezone=auto&wind_speed_unit=ms`
    const request = axios.get(url)
    return request.then(response => response.data)
}

const getWeatherIcon = (code, isDay) =>{
    const url = "http://localhost:3001/icons"
    const iconsList = axios.get(url)
    return iconsList.then(response => response.data[0][code][isDay])
}

export default { getWeather, getWeatherIcon }