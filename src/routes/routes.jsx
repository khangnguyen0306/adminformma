import { createBrowserRouter, Navigate } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import AuthGuard from "./AuthGuard";
import SellerGuard from "./SellerGuard";
import Admin from "../pages/admin/Admin";
import AdminLayout from "../layout/AdminLayout";
import AdminUser from "../pages/admin/AdminUser/AdminUser";
import AdminDashboard from "../pages/admin/AdminDashboard/AdminDashboard";
import BuyerLayout from "../layout/BuyerLayout";
import Buyer from "../pages/buyer/buyer";
// import Chat from "../pages/buyer/Chat";
const Login = Loadable({ loader: () => import("../pages/login/Login") });
const Register = Loadable({ loader: () => import("../pages/register/Register") });
const Home = Loadable({ loader: () => import("../pages/home/Home") });
const UserProfile = Loadable({ loader: () => import("../pages/userProfile/UserProfile") });
const ProductPage = Loadable({ loader: () => import("../pages/product/ProductPage") });
const ProductDetail = Loadable({ loader: () => import("../pages/product/ProductDetail") });
const errorPage = Loadable({ loader: () => import("../pages/error/Error") });
const Dashboard = Loadable({
  loader: () => import("../pages/dashboard/jsx/Dashboard"),
});
const Seller = Loadable({
  loader: () => import("../pages/seller/flowerManagement/FlowerManager"),
});


export const router = createBrowserRouter([
  {
    path: "/",
    element: Login,
    index: true,
  },

  {
    path: "/login",
    element: Login,
    index: true,
  },

  {
    path: "/seller",
    element: <MainLayout />,
    children: [
      {
        element: <SellerGuard />,
        children: [
          { index: true, element: Seller },
          // { path: "users", element: ManageUser },
          // { path: "users/user-details/:userId", element: Detail },
          // { path: "courses", element: ManageCourse },
          // { path: "money", element: Cost },
          // { path: "quizs", element: Quiz },
          // { path: "create-course", element: CreateCourse },
        ],
      },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path:"/admin/order",
        element: <Admin />,
      },
      {
        path:"/admin/user",
        element: <AdminUser />,
      },
      {
        path:"/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: "/buyer",
    element: <BuyerLayout />,
    children: [
      {
        path:"/buyer/home",
        element: <Buyer />,
      },
      // {
      //   path:"/buyer/chat",
      //   element: <Chat />,
      // },
      // {
      //   path:"/admin/user",
      //   element: <AdminUser />,
      // },
      // {
      //   path:"/admin/dashboard",
      //   element: <AdminDashboard />,
      // },
    ],
  },
  // {
  
  //       path:"/buyer/chat",
  //       element: <Chat />,

  // },
  {
    path: "*",
    element: errorPage,
  },
]);
