import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationText(_, action) {
      return action.payload
    },
  },
})

const { setNotificationText } = notificationSlice.actions

export const setNotification = (content, seconds) => {
  return async (dispatch) => {
    dispatch(setNotificationText(content))
    setTimeout(() => {
      dispatch(setNotificationText(''))
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
