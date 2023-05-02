import { combineReducers } from "redux";
import userReducer from "./auth/auth";
import { adminAPI } from "./apis/adminAPI";
import { warehousesApi } from "./apis/warehousesAPI";
import { salesReportAPI } from "./apis/salesReportAPI";

const rootReducer = combineReducers({
  auth: userReducer,
  [adminAPI.reducerPath]: adminAPI.reducer,
  [warehousesApi.reducerPath]: warehousesApi.reducer,
  [salesReportAPI.reducerPath]: salesReportAPI.reducer,
});

export {
  useGetAllAdminQuery,
  useGetAllManagerQuery,
  useGetAllUserQuery,
  useCrateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "./apis/adminAPI";

export {
  useGetAllWarehousesQuery,
  useGetAllStockProductAndWarehouseInfoByWarehouseIdQuery,
  useDeleteStockProductMutation,
  useUpdateStockProductMutation,
  useGetAllStockHistoryQuery,
  useGetStockSummaryQuery,
} from "./apis/warehousesAPI";

export { useGetAllSalesReportByWarehouseQuery } from "./apis/salesReportAPI";

export default rootReducer;
