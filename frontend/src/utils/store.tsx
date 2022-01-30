import { configureStore } from '@reduxjs/toolkit'
import authenticationReducer from './authenticationSlice'
import playbackReducer from './playbackSlice'

const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        playback: playbackReducer,
    },
})
export default store;