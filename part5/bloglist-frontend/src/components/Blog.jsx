import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, username }) => {
  const [visible, setVisible] = useState(false)
  const owned = blog.user.username === username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
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
    <li style={blogStyle} key={blog.id}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>open</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes} <button onClick={handleLike}>like</button>
          </p>
          <p>
            {blog.user.name} <br />
          </p>
          {owned && <button onClick={handleRemove}>remove</button>}
        </div>
      )}
    </li>
  )
}

export default Blog
