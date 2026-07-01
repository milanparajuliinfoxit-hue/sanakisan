import { baseApi } from "./baseApi";

export const memberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    saveMember: builder.mutation({
      query: (credential) => ({
        url: "/api/createteammember",
        method: "POST",
        body: credential,
      }),
    }), 
    updateMember: builder.mutation({
      query: (credential) => ({
        url: "/api/updateteammember",
        method: "POST",
        body: credential,
      }),
    }), 

    getMemberPagination: builder.mutation({
      query: (credential) => ({
        url: "/api/getallteammember",
        method: "GET",
        body: credential,
      }),
    }), 
    deleteTeamMember: builder.mutation({
      query: (credential) => ({
        url: "/api/admin/deleteteammember",
        method: "PUT",
        body: credential,
      }),
    }), 
   
  }),
});

export const {
  useSaveMemberMutation,
  useUpdateMemberMutation,
  useGetMemberPaginationMutation,
  useDeleteTeamMemberMutation
  
} = memberApi;
