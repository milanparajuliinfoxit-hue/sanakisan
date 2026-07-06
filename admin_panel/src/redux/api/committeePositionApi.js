import { baseApi } from "./baseApi";

export const committeePositionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommitteePositions: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) =>
        `/api/committee-positions?page=${page}&limit=${limit}&search=${search}`,
    }),
    getActiveCommitteePositions: builder.query({
      query: () => `/api/committee-positions/active`,
    }),
    getCommitteePositionById: builder.query({
      query: (id) => `/api/committee-positions/${id}`,
    }),
    createCommitteePosition: builder.mutation({
      query: (body) => ({ url: "/api/committee-positions", method: "POST", body }),
    }),
    updateCommitteePosition: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/committee-positions/${id}`, method: "PUT", body }),
    }),
    deleteCommitteePosition: builder.mutation({
      query: (id) => ({ url: `/api/committee-positions/${id}`, method: "DELETE" }),
    }),
  }),
});

export const {
  useGetCommitteePositionsQuery,
  useGetActiveCommitteePositionsQuery,
  useGetCommitteePositionByIdQuery,
  useCreateCommitteePositionMutation,
  useUpdateCommitteePositionMutation,
  useDeleteCommitteePositionMutation,
} = committeePositionApi;
