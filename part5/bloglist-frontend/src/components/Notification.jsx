const Notification = ({ msg, type }) => {
  if (!msg) {
    return null
  }

  const stylesheet = type === 'w'
    ? {
      color: 'red',
      background: 'lightgray',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
    : {
      color: 'green',
      background: 'lightgray',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }

  return (
    <div style={stylesheet}>
      {msg}
    </div>
  )
}


export default Notification
