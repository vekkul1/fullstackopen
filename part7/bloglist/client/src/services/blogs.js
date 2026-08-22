import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (content) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, { ...content }, config)

  return response.data
}

const edit = async (blog) => {
  const request = await axios.put(`${baseUrl}/${blog.id}`, blog)
  return request.data
}

const like = async (blog) => {
  const liked = {
    ...blog,
    likes: blog.likes + 1,
  }
  const request = await axios.put(`${baseUrl}/${blog.id}`, liked)
  return request.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  console.log(config)
  const request = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return request
}

const comment = async (blog, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const content = { body: comment }
  const request = await axios.post(
    `${baseUrl}/${blog.id}/comments`,
    content,
    config,
  )
  return request
}

export default { getAll, setToken, create, edit, like, remove, comment }
