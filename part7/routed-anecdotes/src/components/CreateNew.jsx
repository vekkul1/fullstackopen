import { useNavigate } from 'react-router-dom'
import { useAnecdotes, useField } from '../hooks'

const CreateNew = () => {
    const content = useField('content')
    const author = useField('author')
    const info = useField('info')
    const navigate = useNavigate()
    const { addAnecdote } = useAnecdotes()

    const handleSubmit = (e) => {
        e.preventDefault()
        let c = content.props.value
        let a = author.props.value
        let i = info.props.value
        addAnecdote({ content: c, author: a, info: i, votes: 0 })
        navigate('/')
    }

    const handleReset = (e) => {
        e.preventDefault()
        content.reset()
        author.reset()
        info.reset()
    }

    return (
        <div>
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content
                    <input {...content.props} />
                </div>
                <div>
                    author
                    <input {...author.props} />
                </div>
                <div>
                    url for more info
                    <input {...info.props} />
                </div>
                <button>create</button>
                <button onClick={handleReset}>reset</button>
            </form>
        </div>
    )
}

export default CreateNew
