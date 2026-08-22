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
  test('renders title, author, url, likes, and creator', () => {
    render(<Blog blog={blog} />)

    const authorAndTitle = screen.getByText(
      'Edsger W. Dijkstra: Canonical string reduction',
    )
    const url = screen.getByText(
      'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    )
    const likes = screen.getByText('1')
    const like = screen.queryByText('like')
    expect(like).toBeNull()
    const username = screen.getByText('rooter')
  })

  test('like button is shown when username', () => {
    render(<Blog blog={blog} username={'Timmy'} />)

    const authorAndTitle = screen.getByText(
      'Edsger W. Dijkstra: Canonical string reduction',
    )
    const url = screen.getByText(
      'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    )
    const likes = screen.getByText('1')
    const like = screen.getByText('like')
    const username = screen.getByText('rooter')
  })

  test('liking function gets called the right amount', async () => {
    const updateBlog = vi.fn()
    render(<Blog blog={blog} updateBlog={updateBlog} username={'timmy'} />)

    const user = userEvent.setup()

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(updateBlog.mock.calls).toHaveLength(2)
  })

  test('delete button is shown to creator', () => {
    render(<Blog blog={blog} username={'root'} />)

    const authorAndTitle = screen.getByText(
      'Edsger W. Dijkstra: Canonical string reduction',
    )
    const url = screen.getByText(
      'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    )
    const likes = screen.getByText('1')
    const like = screen.getByText('like')
    const username = screen.getByText('rooter')
    const remove = screen.getByText('remove')
  })
})
