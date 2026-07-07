import { baseApi } from "./baseApi";

export const contactMessageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactMessages: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "", sortField = "createdAt", sortDir = "DESC" } = {}) =>
        `/api/admin/messages?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}&sortField=${sortField}&sortDir=${sortDir}`,
    }),
    getContactMessageStats: builder.query({
      query: () => "/api/admin/messages/stats",
    }),
    getContactMessageById: builder.query({
      query: (id) => `/api/admin/messages/${id}`,
    }),
    markMessageAsRead: builder.mutation({
      query: (id) => ({ url: `/api/admin/messages/${id}/read`, method: "PATCH" }),
    }),
    updateMessageStatus: builder.mutation({
      query: ({ id, status }) => ({ url: `/api/admin/messages/${id}/status`, method: "PATCH", body: { status } }),
    }),
    deleteContactMessage: builder.mutation({
      query: (id) => ({ url: `/api/admin/messages/${id}`, method: "DELETE" }),
    }),
  }),
});

export const {
  useGetContactMessagesQuery,
  useGetContactMessageStatsQuery,
  useGetContactMessageByIdQuery,
  useMarkMessageAsReadMutation,
  useUpdateMessageStatusMutation,
  useDeleteContactMessageMutation,
} = contactMessageApi;
