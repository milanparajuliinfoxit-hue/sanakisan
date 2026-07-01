import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {logout,setCredentials} from "../slice/authSlice"

const baseQuery = fetchBaseQuery({

   // baseUrl: import.meta.env.VITE_REACT_APP_API_URL,
   baseUrl:import.meta.env.VITE_REACT_APP_API_URL,
   credentials: 'include',

   prepareHeaders: (headers, { getState }) => {
      const access_token = getState().auth.access_token
      if (access_token) {
         headers.set('authorization', `Bearer ${access_token}`)
      }
      return headers
   },
})


const baseQueryWithReAuth = async (args, api, extraOptions) => {
   let result = await baseQuery(args, api, extraOptions)
   if (result?.error?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      // const res = await baseQuery('/api/auth/refresh', api, extraOptions)
      // if (res?.data) {
      //    api.dispatch(setCredentials({ ...res.data }))
      //    result = await baseQuery(args, api, extraOptions)
      // } else {
      //    api.dispatch(logout())
      // }
   }
   return result
}


export const baseApi = createApi({
   baseQuery: baseQueryWithReAuth,
   endpoints: (builder) => ({}),
})

