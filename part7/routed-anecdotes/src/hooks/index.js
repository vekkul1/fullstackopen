import { useState, useEffect } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    const props = {
        type,
        value,
        onChange,
    }
    return {
        props,
        reset,
    }
}

export const useAnecdotes = () => {
    const [anecdotes, setAnecdotes] = useState([])

    useEffect(() => {
        anecdoteService.getAll().then((data) => setAnecdotes(data))
    }, [])

    const addAnecdote = (a) => {
        const newAnecdote = { ...a, id: Math.round(Math.random() * 10000) }
        anecdoteService.createNew(newAnecdote).then((data) => {
            setAnecdotes(anecdotes.concat(data))
        })
    }

    // setBlogs(blogs.filter((b) => b.id !== blog.id))
    const removeAnecdote = async (a) => {
        // console.log('remove', a)
        try {
            await anecdoteService.deleteOne(a)

            setAnecdotes(anecdotes.filter((x) => x.id !== a))
            // console.log(anecdotes)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        anecdotes,
        addAnecdote,
        removeAnecdote,
    }
}
