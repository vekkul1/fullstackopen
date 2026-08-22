import { List, ListItem, Paper, Typography, ListItemText } from '@mui/material'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
  const blogs = useSelector((s) => {
    return [...s.blogs]
  })
  const blogStyle = {
    paddingTop: 10,
    // border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    textDecoration: 'none',
  }
  return (
    <div>
      <List
        style={{ listStyleType: 'none', marginTop: 10 }}
        component={Paper}
        elevation={0}
      >
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Paper elevation={4}>
              <ListItem
                style={blogStyle}
                key={blog.id}
                component={Link}
                to={`/blogs/${blog.id}`}
              >
                <ListItemText
                  primary={blog.title}
                  secondary={blog.author}
                  inset={true}
                ></ListItemText>
              </ListItem>
            </Paper>
          ))}
      </List>
    </div>
  )
}

export default Home
