import AddressPage from "../pages/AddressPage";
import AppPage from "../pages/AppPage";
import LoginPage from "../pages/LoginPage";
import RootLayout from "../pages/RootLayout";
import PageProtected from "./protected";

const routes = [
  {
    path: "/",
    element: (
      <PageProtected needLogin={true} myPath="/">
        <RootLayout>
          <AppPage />
        </RootLayout>
      </PageProtected>
    ),
  },
  {
    path: "/login",
    element: (
      <PageProtected guestOnly={true}>
        <RootLayout>
          <LoginPage />
        </RootLayout>
      </PageProtected>
    ),

  },
  {
    path: "/address",
    element: (
      <PageProtected needLogin={true} myPath="/address">
        <RootLayout>
          <AddressPage />
        </RootLayout>
      </PageProtected>
    ),
  },
];

export default routes;
