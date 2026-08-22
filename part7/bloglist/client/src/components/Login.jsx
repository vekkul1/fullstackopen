import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { newNotification } from '../reducers/notificationReducer'
import { logIn } from '../reducers/userReducer'
import loginService from '../services/login'
import { saveUser } from '../services/persistentUser'
import { useField } from '../hooks'

const Login = () => {
  const username = useField('text')
  const password = useField('password')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const newUser = await loginService.login({
        username: username.props.value,
        password: password.props.value,
      })
      saveUser(newUser)
      dispatch(logIn(newUser))
      dispatch(newNotification('login successful'))
      username.reset()
      password.reset()
      navigate('/')
    } catch {
      dispatch(newNotification('wrong username or password', 'error'))
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <TextField label='Username' {...username.props} />
        </div>
        <div>
          <TextField label='Password' {...password.props} />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  )
}

export default Login
