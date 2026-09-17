import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Component/ErrorPage/ErrorPage";
import NoAccesPage from "./Component/ErrorPage/NoAccesPage";
import HomePage from "./Component/Home/HomePage";
import Welcome from "./Component/Home/Welcome";
import Dashbord from "./Component/Dashboard/Dashbord";
import Profile from "./Component/Profile/Profile";
import SettingPage from "./Component/Settings/SettingPage";
import ProductsPage from "./Component/Products/ProducstPage";
import ProductDetails from "./Component/Products/ProductDetails";
import SuppliersPage from "./Component/Suppliers/SuppliersPage";
import EmployeesPage from "./Component/Employees/EmployeesPage";
import PurchasePage from "./Component/Purchase/PurchasePage";
import StockPage from "./Component/Stock/StockPage";
import SalesPage from "./Component/Sales/SalesPage";
import DeliveryPage from "./Component/Delivery/DeliveryPage";
import CustomersPage from "./Component/Customers/CustomersPage";
import TransactionsPage from "./Component/Transactions/TransactionsPage";
import FinanceReportPage from "./Component/FinanceReport/FinanceReportPage";
import LoginPage from "./Component/Login/LoginPage";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/Servises/Autontification";
import LoaderApp from "@/Component/UI/LoaderApp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import RequirePermission from "@/Component/UI/RequirePermission";
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
        index: true,
        element: <Welcome />,
      },
      {
        path: "/dashboard",
        element: (
          <RequirePermission model="Tableau de bord">
            <Dashbord />
          </RequirePermission>
        ),
      },
      {
        path: "/settings",
        element: (
          <RequirePermission
            models={["Modèles & Permissions", "Types de produits", "Types d'employés"]}
          >
            <SettingPage />
          </RequirePermission>
        ),
      },
      {
        path: "/profile",
        element: (
          <RequirePermission model="Profil">
            <Profile />
          </RequirePermission>
        ),
      },
      {
        path: "/products",
        element: (
          <RequirePermission model="Produits">
            <ProductsPage />
          </RequirePermission>
        ),
      },
      {
        path: "/products/:id",
        element: (
          <RequirePermission model="Produits">
            <ProductDetails />
          </RequirePermission>
        ),
      },
      {
        path: "/suppliers",
        element: (
          <RequirePermission model="Fournisseurs">
            <SuppliersPage />
          </RequirePermission>
        ),
      },
      {
        path: "/employees",
        element: (
          <RequirePermission model="Employés">
            <EmployeesPage />
          </RequirePermission>
        ),
      },
      {
        path: "/purchases",
        element: (
          <RequirePermission model="Achats">
            <PurchasePage />
          </RequirePermission>
        ),
      },
      {
        path: "/stock",
        element: (
          <RequirePermission model="Gestion de Stock">
            <StockPage />
          </RequirePermission>
        ),
      },
      {
        path: "/sales",
        element: (
          <RequirePermission model="Ventes">
            <SalesPage />
          </RequirePermission>
        ),
      },
      {
        path: "/delivery",
        element: (
          <RequirePermission model="Livraisons">
            <DeliveryPage />
          </RequirePermission>
        ),
      },
      {
        path: "/requests",
        element: (
          <RequirePermission model="Demandes clients">
            <CustomersPage />
          </RequirePermission>
        ),
      },
      {
        path: "/finance",
        element: (
          <RequirePermission model="Finance">
            <TransactionsPage />
          </RequirePermission>
        ),
      },
      {
        path: "/finance-report",
        element: (
          <RequirePermission model="Finance Rapport">
            <FinanceReportPage />
          </RequirePermission>
        ),
      },
    ],
  },
]);
