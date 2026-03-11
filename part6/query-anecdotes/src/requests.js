const baseUrl = '/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch anecdotes')
  }
  return await response.json()
}

export const createAnecdote = async (newAnecdote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote),
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Error creating new anecdote')
  }

  return await response.json()
}

export const editAnecdote = async (anecdote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  }

  const response = await fetch(`${baseUrl}/${anecdote.id}`, options)

  if (!response.ok) {
    throw new Error('Error editing anecdote')
  }

  return await response.json()
}
