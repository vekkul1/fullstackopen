import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm  from './BlogForm'

describe('<BlogForm />', () => {
  test('test createBlog', () => {
    const createBlog = vi.fn()
    render(<BlogForm createBlog={createBlog} />)
    
    const user = userEvent.setup()
    const button = screen.getByText('create')
    screen.debug(button)
    user.click(button)
    console.log(createBlog)
    expect(createBlog.mock.calls).toHaveLength(1)
    
 })
})
