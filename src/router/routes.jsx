import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ErrorPage from "../pages/ErrorPage";
import Layout from "../pages/Layout";
import HomePage from "../pages/HomePage";
import NewInvoice from "../pages/NewInvoice";

export const router = createBrowserRouter([
  {
    path: "*",
    element: <ErrorPage />,
  },
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/newinvoice",
        element: <NewInvoice />,
      },
    ],
  },
]);
