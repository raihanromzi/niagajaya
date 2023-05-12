import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const warehousesApi = createApi({
  reducerPath: "warehousesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  endpoints(builder) {
    return {
      getAllWarehouses: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/stock/warehouses?page=${_arg.page || 1}&limit=${
              _arg.limit || 10
            }&manager=${
              _arg.user.role === "ADMIN" ? "" : _arg.user.id
            }&search=${_arg.search[0] || ""}&sortBy=${_arg.sort || "latest"}`,
          );
        },
        providesTags: ["Warehouses"],
      }),
      getAllStockProductAndWarehouseInfoByWarehouseId: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/stock/warehouses/${_arg.warehouseId}?manager=${
              _arg.user.id
            }&page=${_arg.page || 1}&limit=${_arg.limit || 5}&sortBy=${
              _arg.sort || "latest"
            }&search=${_arg.search[0] || ""}`,
          );
        },
        providesTags: ["Products"],
      }),
      updateStockProduct: builder.mutation({
        query: (data) => {
          return {
            url: `/admin/stock/warehouses/${data.warehouseId}/products/${data.productId}`,
            method: "PUT",
            body: {
              quantity: data.quantity,
            },
          };
        },
        invalidatesTags: ["Products"],
      }),
      deleteStockProduct: builder.mutation({
        query: (data) => {
          console.log(data);
          return {
            url: `/admin/stock/warehouses/${data.warehouseId}/products/${data.productId}`,
            method: "DELETE",
          };
        },
        invalidatesTags: ["Products"],
      }),
      getAllStockHistory: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/stock/warehouses/${parseInt(
              _arg.warehouseId,
            )}/histories/${parseInt(_arg.productId)}?manager=${parseInt(
              _arg.user.id,
            )}&start=${_arg.startDate || ""}&end=${_arg.endDate || ""}&page=${
              _arg.page || 1
            }&limit=${_arg.limit || 5}&sortBy=${_arg.sort || "latest"}`,
          );
        },
        providesTags: ["Products"],
      }),
      getStockSummary: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/stock/warehouses/${parseInt(
              _arg.warehouseId,
            )}/histories?manager=${parseInt(_arg.user.id)}&start=${
              _arg.startDate || ""
            }&end=${_arg.endDate || ""}&page=${_arg.page || 1}&limit=${
              _arg.limit || 5
            }&sortBy=${_arg.sort || "latest"}&search=${_arg.search[0] || ""}`,
          );
        },
        providesTags: ["Products"],
      }),
    };
  },
});

export const {
  useGetAllWarehousesQuery,
  useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery,
  useUpdateStockProductMutation,
  useDeleteStockProductMutation,
  useGetAllStockHistoryQuery,
  useGetStockSummaryQuery,
} = warehousesApi;
export { warehousesApi };
