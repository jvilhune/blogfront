import { createSlice } from '@reduxjs/toolkit'

const blogsSlice = createSlice({ 
  name: 'bblogs',
  initialState: [],
  reducers: {
    blogsChange(state, action) {
      console.log('blogsReducer occurred')


      console.log('action', action)
      console.log('action.payload', action.payload)
      console.log('state', state)
      console.log('state', JSON.parse(JSON.stringify(state)))

      return action.payload
    }
  },
})


export const { blogsChange } = blogsSlice.actions
export default blogsSlice.reducer