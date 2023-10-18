import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({ 
  name: 'uuser',
  initialState: '',
  reducers: {
    userChange(state, action) {
      console.log('userReducer occurred')


      console.log('action', action)
      console.log('action.payload', action.payload)
      console.log('state', state)
      console.log('state', JSON.parse(JSON.stringify(state)))

      return action.payload
    }
  },
})


export const { userChange } = userSlice.actions
export default userSlice.reducer