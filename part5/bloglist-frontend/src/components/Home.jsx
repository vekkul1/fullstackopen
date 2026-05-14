import { Link } from 'react-router-dom'

const Home = ({ blogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  return (
    <div>
      <h2>blogs</h2>
      <ul style={{ listStyleType: 'none' }}>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <li style={blogStyle} key={blog.id}>
              <div>
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} {blog.author}
                </Link>
              </div>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Home
