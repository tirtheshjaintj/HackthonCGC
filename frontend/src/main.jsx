import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./modules/auth/Login";
import HomePage from "./modules/home/pages/HomePage";
import NotFoundPage from "./modules/home/pages/NotFound.jsx";
import CreateReport from "./modules/home/pages/CreateReport.jsx";
import SignUp from "./modules/auth/SignUp.jsx";
import MainDashboard from "./modules/admin_dashboard/MainDashboard.jsx/MainDashboard.jsx";
import AdminDashboard from "./modules/admin_dashboard/AdminDashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/create",
        element: <CreateReport />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "/user/admin",
        element: <AdminDashboard />,
        children: [
          {
            index: true, // resolves to /user/admin
            element: <MainDashboard />,
          },
          // You can add more nested routes like:
          // { path: "users", element: <UserManagement /> }, // /user/admin/users
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <GoogleOAuthProvider clientId={import.meta.VITE_GOOGLE_ID}>
      <App />
    </GoogleOAuthProvider>
  </RouterProvider>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("serviceWorker.js")
      .then(() => {})
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  });
}
