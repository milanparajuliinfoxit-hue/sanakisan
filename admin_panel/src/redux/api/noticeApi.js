import { baseApi } from "./baseApi";

export const pressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveNotice: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/postnotice",
        method: "POST",
        body: credential,
      }),
    }),
    updateNotice: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/updatenotice",
        method: "PUT",
        body: credential,
      }),
    }), 
    getNoticePagination: builder.mutation({
      query: (credential) => ({
        url: "/api/getnoticepagination",
        method: "GET",
        params: credential,
      }),
    }),
    deleteNotice: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/deletenotice",
        method: "PUT",
        body: credential,
      }),
    }),
   
  }),
});

export const {
  useSaveNoticeMutation,
  useGetNoticePaginationMutation,
  useDeleteNoticeMutation,
  useUpdateNoticeMutation
  
} = pressApi;
