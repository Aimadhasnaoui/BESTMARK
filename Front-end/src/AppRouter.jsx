import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Component/ErrorPage/ErrorPage";
import HomePage from "./Component/Home/HomePage";
import NoAccesPage from "./Component/ErrorPage/NoAccesPage";
import SettingPage from "./Component/Settings/SettingPage";
import ProductsPage from "./Component/Products/ProducstPage";
import SuppliersPage from "./Component/Suppliers/SuppliersPage";
import EmployeesPage from "./Component/Employees/EmployeesPage";
import PurchasePage from "./Component/Purchase/PurchasePage";
import StockPage from "./Component/Stock/StockPage";
import SalesPage from "./Component/Sales/SalesPage";
import DeliveryPage from "./Component/Delivery/DeliveryPage";
import CustomersPage from "./Component/Customers/CustomersPage";
import TransactionsPage from "./Component/Transactions/TransactionsPage";
import LoginPage from "./Component/Login/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "/settings",
        element: <SettingPage />,
      },
      {
        path: "/products",
        element: <ProductsPage />,
      },
      {
        path: "/suppliers",
        element: <SuppliersPage />,
      },
      {
        path: "/employees",
        element: <EmployeesPage />,
      },
      {
        path: "/purchases",
        element: <PurchasePage />,
      },
      {
        path: "/stock",
        element: <StockPage />,
      },
      {
        path: "/sales",
        element: <SalesPage />,
      },
      {
        path: "/delivery",
        element: <DeliveryPage />,
      },
      {
        path: "/requests",
        element: <CustomersPage />,
      },
      {
        path: "/finance",
        element: <TransactionsPage />,
      },
    ],
  },
  //     {
  //   path: "*",
  //   element: <HomePage></HomePage>,
  // },
]);
