import { useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Paper,
  Tab,
} from '@mui/material'
import { Link } from 'react-router-dom'

const Users = () => {
  const blogs = useSelector((s) => [...s.blogs])
  const users = useSelector((r) => r.allUsers)

  const count = {}
  if (!users) {
    return
  }

  console.log(users)
  users.forEach((u) => (count[u.id] = []))
  for (const b of blogs) {
    count[b.user.id].push(b)
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align='center'>Username</TableCell>
            <TableCell align='right'>Blogs created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.username}>
              <TableCell component={Link} to={`/users/${u.id}`}>
                {u.name}
              </TableCell>
              <TableCell align='center'>{u.username}</TableCell>
              <TableCell align='right'>{count[u.id].length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Users
