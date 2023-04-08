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
            `/admin/stock/warehouses?page=${_arg.page ? _arg.page : 1}&size=${
              _arg.size ? _arg.size : 10
            }&manager=${_arg.user.role === "ADMIN" ? "" : _arg.user.id}`,
          );
        },
        providesTags: ["Warehouses"],
      }),
      getAllStockProductAndWarehouseInfoByWarehouseId: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/stock/warehouses/${_arg.warehouseId}?manager=${_arg.user.id}`,
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
    };
  },
});

export const {
  useGetAllWarehousesQuery,
  useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery,
  useUpdateStockProductMutation,
  useDeleteStockProductMutation,
} = warehousesApi;
export { warehousesApi };
