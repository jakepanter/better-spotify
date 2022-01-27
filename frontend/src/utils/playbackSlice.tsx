import { createSlice } from '@reduxjs/toolkit'

export const playbackSlice = createSlice({
    name: 'playback',
    initialState: {
        paused: false,
        position: 0,
        repeatMode: 0,
        shuffle: false,
        currentTrackId: '',
    },
    reducers: {
        setPlaybackState: (state, action) => {
            console.log(action.payload)
            state.paused = action.payload.paused;
            state.position = action.payload.position;
            state.repeatMode = action.payload.repeatMode;
            state.shuffle = action.payload.shuffle;
            state.currentTrackId = action.payload.currentTrackId;
        },
    },
})

// Action creators are generated for each case reducer function
export const { setPlaybackState } = playbackSlice.actions

export default playbackSlice.reducer