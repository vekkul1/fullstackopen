import { useState } from 'react'

const Display = (props) => {
  return(
    <div>{props.counter}</div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        the app is used by pressing the buttons
      </div>
    )
  }
  return(
    <div>
      button press history: {props.allClicks.join(" ")}
    </div>
  )
}

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat("L"))
    setLeft(left+1)
    setTotal(left+right+1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat("R"))
    setRight(right+1)
    setTotal(left+right+1)
  }

  return (
    <div>
      <div>
        {left}
        <Button onClick={handleLeftClick} text="left"/>
        <Button onClick={handleRightClick} text="right"/>
        {right}
        <History allClicks={allClicks}/>
      </div>
    </div>
  )
}

export default App