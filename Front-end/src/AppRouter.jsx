import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Component/ErrorPage/ErrorPage";
import HomePage from "./Component/Home/HomePage";
import NoAccesPage from "./Component/ErrorPage/NoAccesPage";
import SettingPage from "./Component/Settings/SettingPage";
import ProductsPage from "./Component/Products/ProducstPage";
import SuppliersPage from "./Component/Suppliers/SuppliersPage";
export const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: <LoginPageWithRedirect />,
//     children: [
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },
//     ],
//   },

  {
    path:'/',
    element: <HomePage/>,
    children:[
      {
        path:"/settings",
        element:<SettingPage/>
      },
      {
        path:"/products",
        element:<ProductsPage/>
      }
      ,{
        path:"/suppliers",
        element:<SuppliersPage/>
      }
      
        
    ]
  },
      {
    path: "*",
    element: <HomePage></HomePage>,
  },

])