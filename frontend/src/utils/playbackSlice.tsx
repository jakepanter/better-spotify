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
            state.paused = action.payload.playback.paused;
            state.position = action.payload.playback.position;
            state.repeatMode = action.payload.playback.repeatMode;
            state.shuffle = action.payload.playback.shuffle;
            state.currentTrackId = action.payload.playback.currentTrackId;
        },
    },
})

export interface PlaybackState {
    playback: {
        paused: boolean;
        position: number;
        repeatMode: number;
        shuffle: boolean;
        currentTrackId: string;
    }
}

// Action creators are generated for each case reducer function
export const { setPlaybackState } = playbackSlice.actions

export default playbackSlice.reducer