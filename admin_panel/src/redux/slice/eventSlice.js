import { createSlice } from '@reduxjs/toolkit'

const eventSlice = createSlice({
   name: 'event',
   initialState: {
      event: []
   },
   reducers: {
      setEventData: (state, action) => {
         state.event = action.payload?.data
      }
   }
})
export const { setEventData } = eventSlice.actions
export const eventReducer = eventSlice.reducer
