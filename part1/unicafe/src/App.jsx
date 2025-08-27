import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  let total = props.good + props.neutral + props.bad
  let score = props.good - props.bad
  let positive = props.good/total

  console.log(score)

  if (total === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <>
      <table>
        <tbody>
          <StatisticsLine text="good" value={props.good}/>
          <StatisticsLine text="neutral" value={props.neutral}/>
          <StatisticsLine text="bad" value={props.bad}/>
          <StatisticsLine text="all" value={total}/>
          <StatisticsLine text="average" value={score/total}/>
          <StatisticsLine text="positive" value={positive*100 + " %"}/>
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () =>{
    setGood(good + 1)
    console.log("good", good+1)
  }

  const handleNeutral = () => {
    setNeutral(neutral+1)
    console.log("neutral", neutral+1)
  }

  const handleBad = () =>{
    setBad(bad+1)
    console.log("bad", bad+1)
  }

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <Button onClick={handleGood} text="good"/>
        <Button onClick={handleNeutral} text="neutral"/>
        <Button onClick={handleBad} text="bad"/>
      </div>
      <div>
        <h1>statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad}/>
      </div>
    </>
  )
}

export default App
