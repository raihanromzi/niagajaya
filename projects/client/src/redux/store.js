import { combineReducers } from "redux";
import userReducer from "./auth/auth";
import { adminAPI } from "./apis/adminAPI";
import { warehousesApi } from "./apis/warehousesAPI";

const rootReducer = combineReducers({
  auth: userReducer,
  [adminAPI.reducerPath]: adminAPI.reducer,
  [warehousesApi.reducerPath]: warehousesApi.reducer,
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
} from "./apis/warehousesAPI";

export default rootReducer;
