import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((r) => {
    return r.notification
  })
  if (notification === null) {
    return null
  }

  return (
    <Alert
      style={{ marginBottom: 10, marginTop: 10 }}
      severity={notification.type}
    >
      {notification.text}
    </Alert>
  )
}

export default Notification
