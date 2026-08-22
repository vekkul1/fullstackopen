import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    loginUser(state, action) {
      return action.payload
    },
    logoutUser(state) {
      return null
    },
  },
})

const { loginUser, logoutUser } = userSlice.actions

export const logIn = (user) => {
  return async (dispatch) => {
    dispatch(loginUser(user))
    blogService.setToken(user.token)
  }
}

export const logOut = () => {
  return async (dispatch) => {
    dispatch(logoutUser())
  }
}

export default userSlice.reducer
