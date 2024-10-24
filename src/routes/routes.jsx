import { createBrowserRouter, Navigate } from "react-router-dom";
import Loadable from "./Loadable";
import MainLayout from "../layout/MainLayout";
import AuthGuard from "./AuthGuard";
import SellerGuard from "./SellerGuard";
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

  // {
  //   path: "/admin",
  //   element: <MainLayout />,
  //   children: [
  //     {
  //       path: "/admin",
  //       element: <Navigate to="/" replace />,
  //     },
  //     {
  //       element: <AdminGuard />,
  //       children: [
  //         { index: true, element: Admin },
  //         { index: true, path: "dashboard", element: Admin },
  //         { path: "users", element: ManageUser },
  //         { path: "users/user-details/:userId", element: Detail },
  //         { path: "courses", element: ManageCourse },
  //         { path: "money", element: Cost },
  //         { path: "quizs", element: Quiz },
  //         { path: "create-course", element: CreateCourse },
  //       ],
  //     },
  //   ],
  // },
  {
    path: "*",
    element: errorPage,
  },
]);
