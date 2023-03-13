import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import AddressPage from "./routes/AddressPage";
import IndexPage from "./routes/index";
import LoginPage from "./routes/LoginPage";
import RegisterPage, { registerAction } from "./routes/register";
import SetPasswordPage, { setPasswordAction } from "./routes/setPassword";
import SettingsPage from "./routes/settings";

import AuthProvider from './hoc/authProvider';
import rootReducer from './redux/store';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import 'leaflet/dist/leaflet.css'
import PageProtected from "./routes/protected";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: IndexPage },
      { path: "register", Component: RegisterPage, action: registerAction },
      {
        path: "set-password/:code",
        Component: SetPasswordPage,
        action: setPasswordAction,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
      {
        path: "login",
        Component: LoginPage
      },
      {
        path: "address",
        Component: AddressPage
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
