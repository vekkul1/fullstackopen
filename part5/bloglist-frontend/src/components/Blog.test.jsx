import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
      author: 'Edsger W. Dijkstra',
      title: 'Canonical string reduction',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 1,
      user: {
        username: 'root',
        name: 'rooter',
        id: '69681d323275085ec7bf8c37',
      },
    }

describe('<Blog />', () => {
  test('renders only title and author', () => { 
    render(<Blog blog={blog}/>)

    const authorAndTitle = screen.getByText('Canonical string reduction Edsger W. Dijkstra') 
    const url = screen.queryByText('http://www.cs.utexas.edu/~EWD/')
    expect(url).toBeNull()
    const likes = screen.queryByText('1')
    expect(likes).toBeNull()
    const username = screen.queryByText('rooter')
    expect(username).toBeNull()
  })

  test('renders more info when button pressed', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('open')
    await user.click(button)

    const url = screen.getByText('http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html')
    const likes = screen.getByText('1')
    const username = screen.getByText('rooter') 
  })

  test('liking function gets called the right amount', async () => {
    const updateBlog = vi.fn()
    render(<Blog blog={blog} updateBlog={updateBlog} />)

    const user = userEvent.setup()
    const openButton = screen.getByText('open')
    await user.click(openButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})
