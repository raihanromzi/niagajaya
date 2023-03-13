import { ChakraProvider } from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Root from "./routes/root";
import { configureStore } from '@reduxjs/toolkit';
import AuthProvider from './hoc/authProvider';
import rootReducer from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import 'leaflet/dist/leaflet.css'



// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//   },
// ]);

const store = configureStore({ reducer: rootReducer });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
        {/* <RouterProvider router={router} /> */}
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
