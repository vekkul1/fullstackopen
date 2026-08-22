import { createSlice } from '@reduxjs/toolkit'
import blogs from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    createBlog(state, action) {
      state.push(action.payload)
    },
    likeBlog(state, action) {
      const id = action.payload
      const blogToLike = state.find((b) => b.id === id)
      const changed = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
      }
      return state.map((b) => (b.id !== id ? b : changed))
    },
    setBlogs(state, action) {
      return action.payload
    },
    editBlog(state, action) {
      return state.map((b) => (b.id !== action.payload.id ? b : action.payload))
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
  },
})

const { setBlogs, createBlog, editBlog, removeBlog } = blogSlice.actions

export const newBlog = (content) => {
  return async (dispatch) => {
    const request = await blogs.create(content)
    dispatch(createBlog(request))
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const b = await blogs.getAll()
    dispatch(setBlogs(b))
  }
}

export const likeFor = (blog) => {
  return async (dispatch) => {
    const request = await blogs.like(blog)
    dispatch(editBlog(request))
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    const request = await blogs.remove(blog)
    dispatch(removeBlog(request.id))
  }
}

export const commentOnBlog = (blog, comment) => {
  return async (dispatch) => {
    const request = await blogs.comment(blog, comment)
    dispatch(editBlog(request))
  }
}

export const { likeBlog } = blogSlice.actions
export default blogSlice.reducer
