import { baseApi } from "./baseApi";

export const committeeTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommitteeTypes: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) =>
        `/api/committee-types?page=${page}&limit=${limit}&search=${search}`,
    }),
    getActiveCommitteeTypes: builder.query({
      query: () => `/api/committee-types/active`,
    }),
    getCommitteeTypeById: builder.query({
      query: (id) => `/api/committee-types/${id}`,
    }),
    createCommitteeType: builder.mutation({
      query: (body) => ({ url: "/api/committee-types", method: "POST", body }),
    }),
    updateCommitteeType: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/committee-types/${id}`, method: "PUT", body }),
    }),
    deleteCommitteeType: builder.mutation({
      query: (id) => ({ url: `/api/committee-types/${id}`, method: "DELETE" }),
    }),
  }),
});

export const {
  useGetCommitteeTypesQuery,
  useGetActiveCommitteeTypesQuery,
  useGetCommitteeTypeByIdQuery,
  useCreateCommitteeTypeMutation,
  useUpdateCommitteeTypeMutation,
  useDeleteCommitteeTypeMutation,
} = committeeTypeApi;
