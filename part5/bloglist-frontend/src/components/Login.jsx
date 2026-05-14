import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import blogService from '../services/blogs'

const Login = ({ showNotification, setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const newUser = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(newUser))
      setUser(newUser)
      showNotification('login successful')
      blogService.setToken(newUser.token)
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'w')
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login
