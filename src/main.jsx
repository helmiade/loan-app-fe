import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import CustomerPage from "./pages/CustomerPage.jsx";
import Home from "./pages/Home.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { AdminPage } from "./pages/AdminPage.jsx";
import RegisterCustomer from "./pages/Register.jsx";
import CreateTransaction from "./pages/CreateTransaction.jsx";
import HistoryOrder from "./pages/HistoryOrder.jsx";
import LoanRequest from "./pages/admin/LoanRequest.jsx";
import LoanType from "./pages/admin/LoanType.jsx";

// Definisikan router
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "customer",
        element: <CustomerPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
      {
        path: "register",
        element: <RegisterCustomer />,
      },
      {
        path: "create-loan",
        element: <CreateTransaction />,
      },
      {
        path: "history",
        element: <HistoryOrder />,
      },
      {
        path: "request",
        element: <LoanRequest />,
      },
      {
        path: "loan-type",
        element: <LoanType />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
