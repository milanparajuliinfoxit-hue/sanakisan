import { createSlice } from '@reduxjs/toolkit'

const pressSlice = createSlice({
   name: 'press',
   initialState: {
      press: []
   },
   reducers: {
      setPressData: (state, action) => {
         state.press = action.payload?.data
      }
   }
})
export const { setPressData } = pressSlice.actions
export const pressReducer = pressSlice.reducer
