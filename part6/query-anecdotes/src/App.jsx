import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, editAnecdote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const voteForMutation = useMutation({
    mutationFn: editAnecdote,
    onSuccess: (newAnecdote) => {
      const anecs = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(
        ['anecdotes'],
        anecs.map((a) => (a.id !== newAnecdote.id ? a : newAnecdote)),
      )
    },
  })

  const handleVote = (anecdote) => {
    voteForMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    console.log('vote')
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>loading...</div>
  }
  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
