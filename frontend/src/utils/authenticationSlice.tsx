import { createSlice } from '@reduxjs/toolkit'

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        accessToken: '',
        refreshToken: '',
        expiresIn: '',
    },
    reducers: {
        updateAuthentication: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.expiresIn = action.payload.expiresIn;
        },
    },
})

// Action creators are generated for each case reducer function
export const { updateAuthentication } = authenticationSlice.actions

export default authenticationSlice.reducer