import { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import NoteForm from './components/Note'
import noteService from './services/notes'
import LoginForm from './components/Login'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Togglable from './components/Togglable'

const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  const noteFormRef = useRef()

  useEffect(() => {
    noteService.getAll().then(r => {
      setNotes(r)
      console.log('r', r)
    })
  }, [])

  useEffect(() => {
    console.log('effect')
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(response =>{
        setNotes(notes.concat(response))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(n => n.important)

  const toggleImportanceOf = (id) => {
    console.log("imp of ", id)
    const note = notes.find(n => n.id === id)
    const changedNote = {...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response))
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content}' was already deleted from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== note.id))
      })
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const newUser = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(newUser)
      )
      noteService.setToken(user.token)
      setUser(newUser)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}
      {user && (
        <div>
          <p>logged in as {user.name}!</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm
              createNote={addNote}
            />
          </Togglable>
        </div>
      )}

      <div>
        <button onClick= {() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow  && notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <Footer />
    </div>
  )
}

export default App
