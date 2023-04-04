import { combineReducers } from "redux";
import userReducer from "./auth/auth";
import { adminAPI } from "./apis/adminAPI";

const rootReducer = combineReducers({
  auth: userReducer,
  [adminAPI.reducerPath]: adminAPI.reducer,
});

export { useGetAllAdminQuery, useGetAllManagerQuery, useGetAllUserQuery, useCrateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } from "./apis/adminAPI";

export default rootReducer;
