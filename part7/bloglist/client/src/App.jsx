import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'
import ErrorBoundary from './components/ErrorBoundary'
import Notification from './components/Notification'
import Login from './components/Login'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Home from './components/Home'
import Users from './components/Users'
import User from './components/User'
import { getUser, removeUser } from './services/persistentUser'
import { initializeBlogs } from './reducers/blogReducer'
import { newNotification } from './reducers/notificationReducer'
import { logIn, logOut } from './reducers/userReducer'
import { initUsers } from './reducers/allUsersReducer'

const App = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initUsers())
    const loggedInUser = getUser()
    if (loggedInUser) {
      const u = JSON.parse(loggedInUser)
      dispatch(logIn(u))
    }
  }, [dispatch])

  const match = useMatch('/blogs/:id')
  const blogId = match ? match.params.id : null
  const matchId = useMatch('/users/:id')
  const userId = matchId ? matchId.params.id : null
  // const blog = match ? blogs.find((b) => b.id === match.params.id) : null

  // useEffect(() => {
  //   const loggedInUser = getUser()
  //   if (loggedInUser) {
  //     const u = JSON.parse(loggedInUser)
  //     dispatch(logIn(u))
  //   }
  // }, [dispatch])

  const user = useSelector((r) => r.user)

  const handleLogOut = async (event) => {
    event.preventDefault()

    try {
      dispatch(logOut())
      removeUser()
      dispatch(newNotification(`Logged out user ${user.name}`))
      navigate('/')
    } catch (e) {
      console.log(e)
      dispatch(newNotification('logging out failed'))
    }
  }

  const loginLink = () => (
    <Button color='inherit' component={Link} to='/login'>
      login
    </Button>
  )
  const logoutLink = () => (
    <>
      <Button color='inherit' component={Link} to='/create'>
        New Blog
      </Button>
      <Button color='inherit' component='button' onClick={handleLogOut}>
        Logout
      </Button>
    </>
  )

  return (
    <Container>
      <ErrorBoundary>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
              Blogs App
            </Typography>
            <Button color='inherit' component={Link} to='/'>
              Blogs
            </Button>
            <Button color='inherit' component={Link} to='/users'>
              Users
            </Button>
            {!user && loginLink()}
            {user && logoutLink()}
          </Toolbar>
        </AppBar>
      </ErrorBoundary>

      <ErrorBoundary>
        <Notification />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<BlogForm navigate={navigate} />} />

          <Route path='users' element={<Users />} />
          <Route path='/login' element={<Login />} />
          <Route path='/blogs/:id' element={<Blog {...{ blogId }} />} />
          <Route path='/users/:id' element={<User id={userId} />} />
          <Route path='*' element={<h1>404 - Not Found</h1>} />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App
