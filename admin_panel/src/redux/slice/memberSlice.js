import { createSlice } from '@reduxjs/toolkit'

const memberSlice = createSlice({
   name: 'member',
   initialState: {
      member: []
   },
   reducers: {
      setMemberData: (state, action) => {
         state.member = action.payload?.data
      }
   }
})
export const { setMemberData } = memberSlice.actions
export const memberReducer = memberSlice.reducer
