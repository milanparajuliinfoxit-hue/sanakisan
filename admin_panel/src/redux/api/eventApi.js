import { baseApi } from "./baseApi";

export const pressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveEvent: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/saveevent",
        method: "POST",
        body: credential,
      }),
    }), 
    updateEvent: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/updateevent",
        method: "PUT",
        body: credential,
      }),
    }),
    getEventPagination: builder.mutation({
      query: (credential) => ({
        url: "/api/geteventpagination",
        method: "GET",
        params: credential,
      }),
    }),

    deleteEvent: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/deleteevent",
        method: "PUT",
        body: credential,
      }),
    }),
   
  }),
});

export const {
  useSaveEventMutation,
  useGetEventPaginationMutation,
  useDeleteEventMutation,
  useUpdateEventMutation
  
} = pressApi;
