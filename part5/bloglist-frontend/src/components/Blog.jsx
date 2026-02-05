import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  const [visible, setVisible] = useState(false)
  const owned = blog.user.username === username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const handleLike = event => {
    event.preventDefault()
    updateBlog({
      ...blog,
      likes: blog.likes + 1
    })
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog)
    }
  }

  return (
    <div style={blogStyle} key={blog.id}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>open</button>
      </div>
      {visible && (
        <div>
          {blog.url} <br />
          {blog.likes} <button onClick={handleLike}>like</button> <br />
          {blog.user.name} <br />
          {owned && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  )}

export default Blog
