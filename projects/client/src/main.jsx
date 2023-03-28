import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import IndexPage from "./routes/index";
import LoginPage from "./routes/LoginPage";
import RegisterPage, { registerAction } from "./routes/register";
import SetPasswordPage, { setPasswordAction } from "./routes/setPassword";
import SettingsPage from "./routes/settings";
import ChangeEmailPage, { changeEmailAction } from "./routes/changeEmail";
import ResetPasswordEmail from "./routes/setPasswordEmail";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import AuthProvider from "./hoc/authProvider";
import rootReducer from "./redux/store";

import "leaflet/dist/leaflet.css";

import WarehousePage from "./routes/warehouse";
import WarehouseUpdatePage from "./routes/warehouseUpdate";
import WarehouseCreatePage from "./routes/warehouseCreate";
import ProductsPage from "./routes/products";
import SettingAddressPage from "./routes/settingAddress";
import AddressCreatePage from "./routes/addressCreate";
import AddressUpdatePage from "./routes/addressUpdate";
import PageProtected from "./routes/protected";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: IndexPage },
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
        path: "reset-password/email",
        Component: ResetPasswordEmail,
      },
      {
        path: "warehouses",
        Component: WarehousePage,
      },
      {
        path: "warehouses/edit/:id",
        Component: WarehouseUpdatePage,
      },
      {
        path: "warehouses/create",
        Component: WarehouseCreatePage,
      },
      {
        path: "products",
        Component: ProductsPage,
      },
      {
        path: "settings/address",
        Component: () => (
          <PageProtected needLogin={true}>
            <SettingAddressPage />
          </PageProtected>
        ),
      },
      {
        path: "settings/address/create",
        Component: () => (
          <PageProtected needLogin={true}>
            <AddressCreatePage />
          </PageProtected>
        ),
      },
      {
        path: "settings/address/edit/:id",
        Component: () => (
          <PageProtected needLogin={true}>
            <AddressUpdatePage />
          </PageProtected>
        ),
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
