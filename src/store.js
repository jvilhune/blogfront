import { configureStore } from '@reduxjs/toolkit'

import blogsReducer from './reducers/blogsReducer'
import userReducer from './reducers/userReducer'
import notificationReducer from './reducers/notificationReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    bblogs: blogsReducer,
    uuser: userReducer
  }
})

console.log('store', store.getState())

export default store

    //anecdotes: reducer,
    //filter: filterReducer,