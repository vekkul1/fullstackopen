import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const useNotification = (message, type = null) => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const newUser = await loginService.login({
        username, password
      })
      window.localStorage.setItem( 'loggedBlogappUser', JSON.stringify(newUser))
      setUser(newUser)
      useNotification("login successful")

    } catch {
      useNotification("wrong username or password", "w")
    }
  }

  const handleLogOut = async event => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setNotification(`Logged out user ${user.name}`)
    setUser(null)
  }

  const handleCreate = async event => {
    event.preventDefault()
    try { 
      const response = await blogService.create(author, title, url)
      setBlogs(blogs.concat(response))
      setAuthor('')
      setTitle('')
      setUrl('')
      useNotification(`created blog '${response.title}' by ${response.author}`)
    } catch (error) {
      console.log(error)
      useNotification("creating blog failed", "w")
    }
  }

  const loginForm = () => {
    return (
        <div>
          <h2>Log in to application</h2>
          <Notification msg={notification} type={notificationType}/>
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

  const blogDisplay = () => {
    return (
      <div>
        <h2>blogs</h2>
        <Notification msg={notification} type={notificationType}/>
        <p>
          logged in as {user.name}!
          <button type="button" onClick={handleLogOut}>logout</button>
        </p>
        <h2>create new</h2>
          <form onSubmit={handleCreate}>
            <div>
              <label>
                title: 
                <input
                  type="text"
                  value={title}
                  onChange={({ target }) => setTitle(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                author: 
                <input
                  type="text"
                  value={author}
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                url: 
                <input
                  type="text"
                  value={url}
                  onChange={({ target }) => setUrl(target.value)}
                />
              </label>
            </div>
              <button type="submit">create</button>
          
          </form>
          
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
    )}

  return(
    <div>
      {!user && loginForm()}
      {user && blogDisplay()}
    </div>
  )}

export default App
