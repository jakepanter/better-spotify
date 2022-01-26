import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './authenticationSlice'

export default configureStore({
    reducer: {
        authentication: counterReducer,
    },
})