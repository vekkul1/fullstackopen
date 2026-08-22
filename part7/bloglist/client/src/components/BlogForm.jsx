import { TextField, Button } from '@mui/material'
import { useDispatch } from 'react-redux'
import { newBlog } from '../reducers/blogReducer'
import { newNotification } from '../reducers/notificationReducer'
import { useField } from '../hooks'

const BlogForm = ({ navigate }) => {
  const dispatch = useDispatch()
  const title = useField('text')
  const author = useField('text')
  const url = useField('url')

  const handleCreate = (event) => {
    try {
      event.preventDefault()
      const blog = {
        title: title.props.value,
        author: author.props.value,
        url: url.props.value,
      }
      dispatch(newBlog(blog))
      dispatch(
        newNotification(
          `created blog '${blog.title}' by ${blog.author}`,
          'success',
        ),
      )
      navigate('/')
      url.reset()
      author.reset()
      title.reset()
    } catch (e) {
      console.log(e)
      dispatch(newNotification('creating blog failed', 'error'))
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <TextField label='Title' {...title.props} />
        </div>
        <div>
          <TextField label='Author' {...author.props} />
        </div>
        <div>
          <TextField label='Link' {...url.props} />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
