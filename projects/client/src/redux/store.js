import userReducer from "./auth/auth";
import adminReducer from "./auth/authAdmin";
import { configureStore } from "@reduxjs/toolkit";
import { adminAPI } from "./apis/adminAPI";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    authAdmin: adminReducer,
    [adminAPI.reducerPath]: adminAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(adminAPI.middleware);
  },
});

export { useGetAllAdminQuery, useGetAllManagerQuery, useGetAllUserQuery, useCrateAdminMutation, useUpdateAdminMutation, useDeleteAdminMutation } from "./apis/adminAPI";
