import { baseApi } from './baseApi'

export const authApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
      login: builder.mutation({
         query: (credential) => ({
            url: '/api/auth/login',
            method: 'POST',
            body: { ...credential },
         }),
      }),
      logout: builder.mutation({
         query: (credential) => ({
            url: '/api/auth/logout',
            method: 'POST',
            body: { ...credential }
         }),
      }),
   }),
})

export const { useLoginMutation, useLogoutMutation } = authApi