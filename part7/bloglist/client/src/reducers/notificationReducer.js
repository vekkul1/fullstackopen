import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    },
  },
})

const { setNotification, clearNotification } = notificationSlice.actions

export const newNotification = (text, type = 'success', seconds = 6) => {
  return async (dispatch) => {
    dispatch(setNotification({ text, type }))
    setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
