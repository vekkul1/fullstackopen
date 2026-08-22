import {
  Card,
  Link,
  Typography,
  Button,
  ButtonGroup,
  TextField,
  ListItem,
  List,
  ListItemText,
  Paper,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, likeFor, commentOnBlog } from '../reducers/blogReducer'
import { newNotification } from '../reducers/notificationReducer'
import { useField } from '../hooks'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blogId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const comment = useField('text')
  const blog = useSelector((r) => {
    return r.blogs.find((b) => b.id === blogId)
  })
  const user = useSelector((r) => r.user)
  const username = user ? user.username : null
  if (!blog) {
    // console.log(blog, blogId)
    return <h1>404 - Blog Not Found</h1>
  }

  const owned = blog.user.username === username

  const handleLike = (content) => {
    try {
      dispatch(likeFor(content))
      dispatch(newNotification(`Liked post ${blog.title}}`))
    } catch (e) {
      console.log(e)
      dispatch(newNotification('error liking post'))
    }
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(deleteBlog(blog))
        navigate('/')
        dispatch(
          newNotification(`Removed blog ${blog.title} by ${blog.author}`),
        )
      } catch (error) {
        console.log(error)
        dispatch(newNotification('removing blog failed', 'error'))
      }
    }
  }

  const handleComment = (event) => {
    event.preventDefault()
    try {
      dispatch(commentOnBlog(blog, comment.props.value))
      comment.reset()
    } catch (error) {
      console.log(error)
      dispatch(newNotification('adding comment failed', 'error'))
    }
  }

  return (
    <Card
      style={{ padding: 20, marginTop: 20, backgroundColor: '#fbfbfb' }}
      component={Paper}
      elevation={3}
    >
      <Typography variant='h5' sx={{ marginBottom: 1.25 }}>
        {blog.title}
      </Typography>
      <Typography
        variant='body1'
        sx={{ color: 'text.secondary', marginBottom: 1 }}
      >
        by {blog.author} <br />
      </Typography>
      <Typography variant='body2' sx={{ marginBottom: 0.75 }}>
        <Link>{blog.url}</Link>
      </Typography>
      <Typography
        variant='body2'
        sx={{ color: 'text.secondary', marginBottom: 1 }}
      >
        added by {blog.user.name}
      </Typography>
      <Typography variant='body1' component='div'>
        {blog.likes} likes
        <ButtonGroup variant='outlined' color='blue' sx={{ marginLeft: 1 }}>
          {username && (
            <Button color='primary' onClick={() => handleLike(blog)}>
              like
            </Button>
          )}
          {owned && (
            <Button color='secondary' onClick={handleRemove}>
              remove
            </Button>
          )}
        </ButtonGroup>
      </Typography>
      <Typography variant='h6' sx={{ marginTop: 1.25 }}>
        Comments:
      </Typography>
      <form onSubmit={handleComment}>
        <TextField label='comment' {...comment.props} size='small' />
        <Button type='submit' variant='contained' size='medium'>
          Add Comment
        </Button>
      </form>
      <List>
        {blog.comments.map((k) => (
          <ListItem
            key={k._id}
            component={Paper}
            elevation={2}
            sx={{ marginTop: 1 }}
          >
            <ListItemText primary={k.body}></ListItemText>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

export default Blog
