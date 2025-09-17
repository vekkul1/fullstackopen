const Notification = ({ message, type}) => {
    if (message === null) {
        return null
    }

    const styleSheet = type === "w" 
    ? {
        color: "red",
        background: "lightgray",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }
    : {
        color: "green",
        background: "lightgray",
        fontSize: 20,
        borderStyle: "solid",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }




    return (
        <div style={styleSheet}>
            {message}
        </div>
    )
}

export default Notification