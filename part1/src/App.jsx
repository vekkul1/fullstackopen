const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>
        Hello {props.name}! you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const nimi = "Arabella"
  const ika = "20"
  return (
  <>
    <h1>Greetings</h1>
    <Hello name={nimi} age={ika}/>
    <Hello name="veeti" age={6+7+7}/>
  </>
  )
}

export default App 