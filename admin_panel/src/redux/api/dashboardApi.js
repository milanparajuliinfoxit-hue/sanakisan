import { baseApi } from "./baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/api/admin/dashboard/stats",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
