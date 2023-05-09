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
      postNewStockMutation: builder.mutation({
        query: (data) => {
          console.log(data);
          return {
            url: `/admin/warehouses/stock-mutations/create?manager=${data.managerId}`,
            method: "POST",
            body: {
              exporterId: parseInt(data.exporterId),
              importerId: parseInt(data.importerId),
              productId: data.productId,
              quantity: data.quantity,
            },
          };
        },
        invalidatesTags: ["stockMutation"],
      }),
      getAllImporterWarehouse: builder.query({
        query: (data) => {
          return {
            url: `/admin/importerwarehouses/${parseInt(data.warehouseId)}`,
            method: "GET",
          };
        },
        providesTags: ["importerWarehouse"],
      }),
      getAllImporterWarehouseStock: builder.query({
        query: (data) => {
          return {
            url: `/admin/exporterwarehouse/${parseInt(data.warehouseId)}/stock`,
            method: "GET",
          };
        },
        providesTags: ["importerWarehouseStock"],
      }),
      getWarehouseById: builder.query({
        query: (data) => {
          return {
            url: `/admin/warehouses/${parseInt(data.warehouseId)}`,
            method: "GET",
          };
        },
        providesTags: ["warehouse"],
      }),
    };
  },
});

export const {
  useGetAllStockMutationQuery,
  usePutApproveStockMutationMutation,
  usePutCancelStockMutationMutation,
  usePostNewStockMutationMutation,
  useGetAllImporterWarehouseQuery,
  useGetAllImporterWarehouseStockQuery,
  useGetWarehouseByIdQuery,
} = stockMutationApi;
export { stockMutationApi };
