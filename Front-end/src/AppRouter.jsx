import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Component/ErrorPage/ErrorPage";
import NoAccesPage from "./Component/ErrorPage/NoAccesPage";
import HomePage from "./Component/Home/HomePage";
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
import { useQuery } from "@tanstack/react-query";
import { me } from "@/Servises/Autontification";
import LoaderApp from "@/Component/UI/LoaderApp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
function RederirectLogin() {
  const navigate = useNavigate();
  const { isPending, isSuccess, isError } = useQuery({
    queryKey: ["me"],
    queryFn: () => me(),
    retry: false, // Ne pas réessayer si on a une erreur 401
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess]);
  return (
    <>
      {isPending && <LoaderApp></LoaderApp>}
      {isError && <Outlet></Outlet>}
    </>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <RederirectLogin></RederirectLogin>,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
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
]);
