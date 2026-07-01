import { createSlice } from '@reduxjs/toolkit'

const noticeSlice = createSlice({
   name: 'notice',
   initialState: {
      notice: []
   },
   reducers: {
      setNoticeData: (state, action) => {
         state.notice = action.payload?.data
      }
   }
})
export const { setNoticeData } = noticeSlice.actions
export const noticeReducer = noticeSlice.reducer
