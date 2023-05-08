import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const stockMutationApi = createApi({
  reducerPath: "stockMutationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  endpoints(builder) {
    return {
      getAllStockMutation: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/warehouses/${
              _arg.warehouseId
            }/stock-mutations?manager=${parseInt(_arg.user.id)}&start=${
              _arg.startDate || ""
            }&end=${_arg.endDate || ""}&page=${_arg.page || 1}&limit=${
              parseInt(_arg.limit) || 5
            }&search=${_arg.search[0] || ""}&sortBy=${
              _arg.sort || "latest"
            }&statusMutation=${_arg.statusMutation}`,
          );
        },
        providesTags: ["stockMutation"],
      }),
      putApproveStockMutation: builder.mutation({
        query: (data) => {
          return {
            url: `/admin/warehouses/${data.warehouseId}/stock-mutations/${data.stockMutationId}/approve?manager=${data.managerId}`,
            method: "PUT",
          };
        },
        invalidatesTags: ["stockMutation"],
      }),
      putCancelStockMutation: builder.mutation({
        query: (data) => {
          return {
            url: `/admin/warehouses/${data.warehouseId}/stock-mutations/${data.stockMutationId}/cancel?manager=${data.managerId}`,
            method: "PUT",
          };
        },
        invalidatesTags: ["stockMutation"],
      }),
    };
  },
});

export const {
  useGetAllStockMutationQuery,
  usePutApproveStockMutationMutation,
  usePutCancelStockMutationMutation,
} = stockMutationApi;
export { stockMutationApi };
