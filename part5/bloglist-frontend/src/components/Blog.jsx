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
    <div>
      <h2>
        {blog.author}: {blog.title}
      </h2>
      <p>{blog.url}</p>
      <p>
        {blog.likes}
        {username && <button onClick={handleLike}>like</button>}
      </p>
      <p>
        {blog.user.name} <br />
      </p>
      {owned && <button onClick={handleRemove}>remove</button>}
    </div>
  )
}

export default Blog
