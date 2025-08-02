import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./modules/auth/Login";
import HomePage from "./modules/home/pages/HomePage";
import SignUp from "./modules/auth/SignUp";
import AdminDashboard from "./modules/admin_dashboard/AdminDashboard";
import MainDashboard from "./modules/admin_dashboard/MainDashboard.jsx/MainDashboard";
import { useEffect } from "react";
import { getCookie, removeCookie } from "./axios/cookieFunc";
import axiosInstance from "./axios/axiosConfig";
import useAuthStore from "./store/authSlice/authSlice";
// import other components like Login, Home, etc. when available

function App() {
  const navigate = useNavigate();
  const { setUser, logout } = useAuthStore((state) => state);
  const fetchUserData = async () => {
    try {
      const token = getCookie("authToken");
      console.log(token);
      if (token) {
        const res = await axiosInstance.get(`/user/verifyauth`);
        // dispatch(setCurrUser(res?.data?.user));
        setUser({ user: res?.data?.user, accessToken: res?.data?.token });
      } else {
        // dispatch(clearCurrUser());
        navigate("/login");
      }
    } catch (error) {
      // dispatch(clearCurrUser());
      logout();
      removeCookie("authToken");
      console.log(error.response);
      if (error?.response?.data?.expiredSession) {
        alert(error.response.data.message);
      }
      navigate("/login");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <Routes>
      <Route path="/register" element={<SignUp />} />
      {/* Example routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/user/admin" element={<AdminDashboard />}>
        <Route index element={<MainDashboard />} />
        {/* /user/admin/manage-users */}
        {/* Add more nested admin routes here */}
      </Route>
    </Routes>
  );
}

export default App;
