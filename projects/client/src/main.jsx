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
import AdminProductCategoriesPage, { ProductCategoriesLoader, ProductCategoriesAction } from "./routes/admin/productCategories/index";
import CreateProductCategoryPage, { CreateProductCategoryAction } from "./routes/admin/productCategories/add";
import AdminProductsPage from "./routes/admin/products";
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
import SettingAddressPage from "./routes/settingAddress";
import AddressCreatePage from "./routes/addressCreate";
import AddressUpdatePage from "./routes/addressUpdate";
import PageProtected from "./routes/protected";
import NoAuthorityPage from "./routes/noAuthority";
import ProductDetailPage from "./routes/productDetail";


const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
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
      {
        path: "product-categories",
        children: [
          {
            index: true,
            Component: AdminProductCategoriesPage,
            loader: ProductCategoriesLoader,
            action: ProductCategoriesAction,
          },
          {
            path: "add",
            Component: CreateProductCategoryPage,
            action: CreateProductCategoryAction,
          },
        ],
      },
      { path: "products", Component: AdminProductsPage },
      { path: "management", Component: AdminManagement },
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
