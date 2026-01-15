import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (auth, title, url) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, { 
    title: title,
    author: auth,
    url: url,
  }, config)

  return response.data
}

export default { getAll, setToken, create }
