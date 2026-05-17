import { Card, Link, Typography, Button, ButtonGroup } from '@mui/material'

const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  if (!blog) {
    return null
  }

  const owned = blog.user.username === username

  const handleLike = (event) => {
    event.preventDefault()
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog)
    }
  }

  return (
    <Card style={{ padding: 20, backgroundColor: '#fbfbfb' }}>
      <Typography variant="h5" sx={{ marginBottom: 1.25 }}>
        {blog.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary', marginBottom: 1 }}
      >
        by {blog.author} <br />
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 0.75 }}>
        <Link>{blog.url}</Link>
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', marginBottom: 1 }}
      >
        added by {blog.user.name}
      </Typography>
      <Typography variant="body1">
        {blog.likes} likes
        <ButtonGroup variant="outlined" color="blue" sx={{ marginLeft: 1 }}>
          {username && (
            <Button color="primary" onClick={handleLike}>
              like
            </Button>
          )}
          {owned && (
            <Button color="secondary" onClick={handleRemove}>
              remove
            </Button>
          )}
        </ButtonGroup>
      </Typography>
    </Card>
  )
}

export default Blog
