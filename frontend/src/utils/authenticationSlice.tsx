import { createSlice } from '@reduxjs/toolkit'
import {API_URL} from "./constants";

export const authenticationSlice = createSlice({
    name: 'authentication',
    initialState: {
        accessToken: '',
        refreshToken: '',
        expiresIn: '',
    },
    reducers: {
        getAuthentication: (state) => {
            const queryParams = new URLSearchParams(location.search);
            const accessToken = queryParams.get('access_token') ? queryParams.get('access_token') as string : '';
            const refreshToken = queryParams.get('refresh_token') ? queryParams.get('refresh_token') as string : '';
            const expiresIn = queryParams.get('expires_in') ? queryParams.get('expires_in') as string : '';
            if (accessToken != '' && refreshToken != '' && expiresIn != '') {
                state.accessToken = accessToken;
                state.refreshToken = refreshToken;
                state.expiresIn = expiresIn;
            }
        },

        refreshAuthentication: (state) => {
            if (state.refreshToken != '') {
                const bearerToken = `Bearer ${state.refreshToken}`;
                fetch(`${API_URL}api/spotify/refresh-token`, {
                    headers: {
                        'Authorization': bearerToken
                    }
                }).then(res => res.json()).then(res => res.body).then(res => {
                    state.accessToken = res.accessToken;
                    state.refreshToken = res.refreshToken;
                    state.expiresIn = res.expiresIn;
                });
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { getAuthentication, refreshAuthentication } = authenticationSlice.actions

export default authenticationSlice.reducer