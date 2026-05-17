import { Alert } from '@mui/material'

const Notification = ({ notification }) => {
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
