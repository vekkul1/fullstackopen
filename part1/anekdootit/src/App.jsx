import { useState } from 'react'

function random(max) {

  return Math.floor(Math.random() * (max))
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const ShowAnecdotes = (props) =>{
  if (props.votes) {
    return (
      <div>
        {props.anecdotes[props.selected]} <br/>
        has {props.votes} votes.
      </div>
    )
  }
  return (
    <div>
      {props.anecdotes[props.selected]}<br/>
      has no votes.
    </div>
  )
}

const MostVoted = (props) => {
  if ( props.most ){
    return (
      <div>
        {props.anecdotes[props.most]}<br/>
        has {props.votes[props.most]} votes.
      </div>
    )
  }
  return (
    <div>
      no votes given.
    </div>
  )
  
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState({}) 
  const [selected, setSelected] = useState(random(anecdotes.length))
  const [mostVotes, setMost] = useState()
  
  const handleRandom = () => setSelected(random(anecdotes.length))
  
  const handleVote = () => {
    const copy = { ...votes }
    if ( selected in copy === false ) {
      copy[selected] = 0
    }
    copy[selected] += 1
    if ( copy[selected] > copy[mostVotes] || !mostVotes) {
      setMost(selected)
    }
    setVotes(copy)
  }

  return (
    <>
      <h1>Anecdote of the day</h1>
      <ShowAnecdotes anecdotes={anecdotes} selected={selected} votes={votes[selected]}/>
      <Button onClick={handleVote} text="vote"/>
      <Button onClick={handleRandom} text="new anecdote"/>
      <h1>Anecdote with the most votes</h1>
      <MostVoted anecdotes={anecdotes} most={mostVotes} votes={votes}/>
    </>
  )
}

export default App