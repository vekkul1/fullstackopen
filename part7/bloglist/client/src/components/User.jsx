import { Card, Link, Typography, Button, ButtonGroup } from '@mui/material'
import { newNotification } from '../reducers/notificationReducer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const User = ({ id }) => {
  const blogs = useSelector((s) => [...s.blogs])
  const user = useSelector((r) => {
    return r.allUsers.find((u) => u.id === id)
  })

  if (!user) {
    return <h1>404 - User Not Found</h1>
  }
  const userBlogs = blogs.filter((b) => b.user.id === user.id)
  return (
    <Card style={{ padding: 20, marginTop: 20, backgroundColor: '#fbfbfb' }}>
      <Typography variant='h4' sx={{ marginBottom: 1.25 }}>
        {user.name}
      </Typography>
      <Typography variant='h5' sx={{ marginBottom: 1 }}>
        added blogs
      </Typography>
      <ul>
        {userBlogs.map((b) => (
          <li key={b.id}>{b.title}</li>
        ))}
      </ul>
    </Card>
  )
}

export default User
