import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import RootLayout from "./components/RootLayout";
import AddressPage from "./routes/AddressPage";
import ProductCategoriesPage from "./routes/admin/productCategories";
import ChangeEmailPage, { changeEmailAction } from "./routes/changeEmail";
// import IndexPage from "./routes/index";
import LoginPage from "./routes/LoginPage";
import RegisterPage, { registerAction } from "./routes/register";
import SetPasswordPage, { setPasswordAction } from "./routes/setPassword";
import ResetPasswordEmail from "./routes/setPasswordEmail";
import SettingsPage from "./routes/settings";

import { Provider } from "react-redux";
import AuthProvider from "./hoc/authProvider";
import AdminLoginPage from "./routes/admin/AdminLoginPage";

import "leaflet/dist/leaflet.css";

// import ProductsPage from "./routes/products";
import { store } from "./redux/store";
import AdminList from "./components/AdminList";
import AdminManagement from "./routes/admin/AdminManagement";

import WarehousePage from "./routes/warehouse";
import WarehouseUpdatePage from "./routes/warehouseUpdate";
import WarehouseCreatePage from "./routes/warehouseCreate";
import ProductsPage from "./routes/products";
import NoAuthorityPage from "./routes/noAuthority";
import ProductDetailPage from "./routes/productDetail";


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
        path: "address",
        Component: AddressPage,
      },
      {
        path: "reset-password/email",
        component: ResetPasswordEmail,
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
        path: "products/:id",
        Component: ProductDetailPage,
      },
      {
        path: "no-authority",
        Component: NoAuthorityPage,
      },
    ],
  },
  {
    path: "admin",
    Component: AdminLayout,
    children: [
      { path: "management", Component: AdminManagement },
      { path: "product-categories", Component: ProductCategoriesPage },
      // { path: "products", Component: ProductsPage },
    ],
  },
]);

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
