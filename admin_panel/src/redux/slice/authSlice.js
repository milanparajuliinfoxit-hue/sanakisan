import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
   name: 'auth',
   initialState: {
      access_token: null,
      refresh_token: null,
      userInfo: {}
   },
   reducers: {
      setCredentials: (state, action) => {
         state.userInfo = action.payload?.userInfo
         state.access_token = action.payload?.access_token
         state.refresh_token = action.payload?.refresh_token
      },
      logout: (state, action) => {
         state.access_token = null,
            state.refresh_token = null,
            state.userInfo = {}
      },
   }
})
export const { setCredentials, logout } = authSlice.actions
export const authReducer = authSlice.reducer
export const userInfo = (state) => state.auth.userInfo
export const selectAccessToken = (state) => state.auth.access_token
export const selectRefreshToken = (state) => state.auth.refresh_token
