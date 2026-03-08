import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteForAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find((note) => note.id === id)
      const changed = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1,
      }
      return state.map((n) => (n.id !== id ? n : changed))
    },
    setAnecdotes(state, action) {
      return action.payload
    },
    editAnecdote(state, action) {
      return state.map((a) => (a.id !== action.payload.id ? a : action.payload))
    },
  },
})

const { setAnecdotes, createAnecdote, editAnecdote } = anecdoteSlice.actions

export const newAnecdote = (content) => {
  return async (dispatch) => {
    const request = await anecdoteService.createNew(content)
    dispatch(createAnecdote(request))
  }
}

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const voteFor = (anecdote) => {
  return async (dispatch) => {
    const request = await anecdoteService.voteFor(anecdote)
    dispatch(editAnecdote(request))
  }
}

export const { voteForAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
