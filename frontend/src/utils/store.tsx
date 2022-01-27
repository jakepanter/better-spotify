import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './authenticationSlice'
import playbackReducer from './playbackSlice'

export default configureStore({
    reducer: {
        authentication: authenticationReducer,
        playback: playbackReducer,
    },
})