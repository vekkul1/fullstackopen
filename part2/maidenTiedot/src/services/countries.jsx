import axios from 'axios'
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"

const getAllNames = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data.map(c => c.name.common))
}

const getCountry = (name) => {
    console.log("service", name)
    const request = axios.get(`${baseUrl}/name/${name}`)
    return request.then(response => response.data)
}

export default { getAllNames, getCountry }