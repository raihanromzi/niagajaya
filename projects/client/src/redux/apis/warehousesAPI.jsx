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
              _arg.size ? _arg.size : 5
            }&manager=${_arg.user.role === "ADMIN" ? "" : _arg.user.id}`,
          );
        },
        providesTags: ["Warehouses"],
      }),
      getAllStockProductAndWarehouseInfoByWarehouseId: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/stock/warehouses/${_arg.warehouseId}`,
          );
        },
        providesTags: ["StockProductAndWarehouseInfoByWarehouseId"],
      }),
    };
  },
});

export const {
  useGetAllWarehousesQuery,
  useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery,
} = warehousesApi;
export { warehousesApi };
