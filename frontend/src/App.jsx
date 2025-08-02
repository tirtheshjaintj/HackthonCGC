import {
  useNavigate,
  Outlet,
} from "react-router-dom";

import { useEffect } from "react";
import { getCookie, removeCookie } from "./axios/cookieFunc";
import axiosInstance from "./axios/axiosConfig";
import useAuthStore from "./store/authSlice/authSlice";
import { Toaster } from "react-hot-toast";
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
    <>
      <Outlet />
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
