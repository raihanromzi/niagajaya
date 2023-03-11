import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import IndexPage from "./routes/index";
import RegisterPage, { registerAction } from "./routes/register";
import SetPasswordPage, { setPasswordAction } from "./routes/setPassword";

const router = createBrowserRouter([
  {
    path: "/",
    Component: <RootLayout />,
    children: [
      { index: true, Component: <IndexPage /> },
      { path: "register", Component: <RegisterPage />, action: registerAction },
      {
        path: "set-password/:code",
        Component: <SetPasswordPage />,
        action: setPasswordAction,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
