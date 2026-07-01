import { baseApi } from "./baseApi";

export const pressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    savePress: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/savepressrelease",
        method: "POST",
        body: credential,
      }),
    }), 
    updatePress: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/updatepressrelease",
        method: "PUT",
        body: credential,
      }),
    }),

    getPress: builder.mutation({
      query: (credential) => ({
        url: "/api/getallpressrelease",
        method: "GET",
        params: credential,
      }),
    }),
    deletePress: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/deletepressrelease",
        method: "PUT",
        body: credential,
      }),
    }),

    getSinglePress: builder.mutation({
      query: (credential) => ({
        url: "/api/getpressrelease",
        method: "GET",
        params: credential,
      }),
    }),
   
  }),
});

export const {
  useSavePressMutation,
  useGetPressMutation,
  useDeletePressMutation,
  useUpdatePressMutation
  
} = pressApi;
