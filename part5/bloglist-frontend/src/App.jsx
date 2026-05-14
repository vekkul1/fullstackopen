import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import Notification from './components/Notification'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Home from './components/Home'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  const username = user ? user.username : null

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

  const handleLogOut = async (event) => {
    event.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    showNotification(`Logged out user ${user.name}`)
    navigate('/')
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
      navigate('/')
      showNotification(`Removed blog ${blog.title} by ${blog.author}`)
    } catch (error) {
      console.log(error)

      showNotification('removing blog failed', 'w')
    }
  }

  const padding = {
    padding: 5,
  }

  const loginLink = () => (
    <Link style={padding} to="/login">
      login
    </Link>
  )
  const logoutLink = () => (
    <>
      <Link style={padding} to="/create">
        create
      </Link>
      <button type="button" onClick={handleLogOut}>
        logout
      </button>
    </>
  )

  return (
    <div>
      <Notification msg={notification} type={notificationType} />
      <div>
        <Link style={padding} to="/">
          home
        </Link>

        {!user && loginLink()}
        {user && logoutLink()}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              {...{
                blogs,
                updateBlog,
                removeBlog,
                user,
              }}
            />
          }
        />
        <Route
          path="/create"
          element={<BlogForm createBlog={handleCreate} navigate={navigate} />}
        />

        <Route
          path="/login"
          element={<Login {...{ showNotification, setUser }} />}
        />
        <Route
          path="/blogs/:id"
          element={<Blog {...{ blog, updateBlog, removeBlog, username }} />}
        />
      </Routes>
    </div>
  )
}

export default App
