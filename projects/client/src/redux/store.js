import { combineReducers } from "redux";
import userReducer from "./auth/auth";
import adminReducer from "./auth/authAdmin";

const rootReducer = combineReducers({
  auth: userReducer,
  authAdmin: adminReducer,
});

export const store = configureStore({ reducer: rootReducer });

export default rootReducer;
