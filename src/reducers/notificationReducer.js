import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({ 
  name: 'notification',
  initialState: 'Bloglist application. Vote or add a new comment to an existing blog. Log in and add a new blog or delete a blog you have added',
  reducers: {
    notificationChange(state, action) {
      console.log('notificationReducer occurred')


      console.log('action', action)
      console.log('action.payload', action.payload)
      console.log('state', state)
      console.log('state', JSON.parse(JSON.stringify(state)))

      return action.payload
    }
  },
})


export const { notificationChange } = notificationSlice.actions
export default notificationSlice.reducer