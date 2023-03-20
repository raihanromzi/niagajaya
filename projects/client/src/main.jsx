import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import AddressPage from "./routes/AddressPage";
import LoginPage from "./routes/LoginPage";
import RegisterPage, { registerAction } from "./routes/register";
import SetPasswordPage, { setPasswordAction } from "./routes/setPassword";
import SettingsPage from "./routes/settings";
import ChangeEmailPage, { changeEmailAction } from "./routes/changeEmail";
import ResetPasswordEmail from "./routes/setPasswordEmail";
import AdminLoginPage from "./routes/AdminLoginPage";
import AdminPage from "./routes/AdminPage";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import AuthProvider from "./hoc/authProvider";
import rootReducer from "./redux/store";

import "leaflet/dist/leaflet.css";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { path: "register", Component: RegisterPage, action: registerAction },
      {
        path: "set-password/:token",
        Component: SetPasswordPage,
        action: setPasswordAction,
      },
      {
        path: "settings",
        Component: SettingsPage,
        // loader: settingsLoader,
        // action: settingsAction,
      },
      {
        path: "change-email/:token",
        Component: ChangeEmailPage,
        action: changeEmailAction,
      },
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "/admin/login",
        Component: AdminLoginPage,
      },
      {
        path: "/admin",
        Component: AdminPage,
      },
      {
        path: "address",
        Component: AddressPage,
      },
      {
        path: "reset-password/email",
        component: ResetPasswordEmail,
      },
    ],
  },
]);

const store = configureStore({ reducer: rootReducer });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
