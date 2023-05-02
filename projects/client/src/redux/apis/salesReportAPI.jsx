import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const salesReportAPI = createApi({
  reducerPath: "salesReportAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
  }),
  endpoints(builder) {
    return {
      getAllSalesReportByWarehouse: builder.query({
        async queryFn(_arg, _queryApi, _extraOptions, fetchWithBQ) {
          return await fetchWithBQ(
            `/admin/sales-report/warehouses/${
              _arg.warehouseId
            }?manager=${parseInt(_arg.user.id)}&start=${
              _arg.startDate || ""
            }&end=${_arg.endDate || ""}&page=${_arg.page || 1}&limit=${
              parseInt(_arg.limit) || 5
            }&search=${_arg.search[0] || ""}&sortBy=${
              _arg.sort || "latest"
            }&category=${_arg.category || ""}`,
          );
        },
        providesTags: ["SalesReport"],
      }),
    };
  },
});

export const { useGetAllSalesReportByWarehouseQuery } = salesReportAPI;
export { salesReportAPI };
