import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedInUser) {
      const u = JSON.parse(loggedInUser)
      setUser(u)
      blogService.setToken(u.token)
    }
  }, [])

  const showNotification = (message, type = null) => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
  }

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
    } catch {
      showNotification('wrong username or password', 'w')
    }
  }

  const handleLogOut = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    setNotification(`Logged out user ${user.name}`)
    setUser(null)
  }

  const handleCreate = async (blogObject) => {
    try {
      const response = await blogService.create(
        blogObject.author,
        blogObject.title,
        blogObject.url,
      )
      setBlogs(blogs.concat(response))
      blogFormRef.current.toggleVisibility()
      showNotification(`created blog '${response.title}' by ${response.author}`)
    } catch (error) {
      console.log(error)
      showNotification('creating blog failed', 'w')
    }
  }

  const updateBlog = async (blog) => {
    const response = await blogService.edit(blog)
    setBlogs(blogs.map((b) => (b.id !== blog.id ? b : response)))
  }

  const removeBlog = async (blog) => {
    try {
      await blogService.remove(blog)

      setBlogs(blogs.filter((b) => b.id !== blog.id))

      showNotification(`Removed blog ${blog.title} by ${blog.author}`)
    } catch (error) {
      console.log(error)

      showNotification('removing blog failed', 'w')
    }
  }

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification msg={notification} type={notificationType} />
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
        <Notification msg={notification} type={notificationType} />
        <p>
          logged in as {user.name}!
          <button type="button" onClick={handleLogOut}>
            logout
          </button>
        </p>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm createBlog={handleCreate} />
        </Togglable>
        <ul style={{ listStyleType: 'none' }}>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
                username={user.username}
              />
            ))}
        </ul>
      </div>
    )
  }

  return (
    <div>
      {!user && loginForm()}
      {user && blogDisplay()}
    </div>
  )
}

export default App
