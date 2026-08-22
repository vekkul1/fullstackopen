import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'

const allUserSlice = createSlice({
  name: 'allUsers',
  initialState: null,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
  },
})

const { setUsers } = allUserSlice.actions

export const initUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll()
    dispatch(setUsers(users))
  }
}

export default allUserSlice.reducer
