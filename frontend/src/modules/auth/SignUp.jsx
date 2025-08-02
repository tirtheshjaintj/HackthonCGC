import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";
// import sign from './sign.png'
import Cookies from "universal-cookie";
import Loader from "../../components/Loader";
import PasswordInp from "../../components/Auths/PasswordInp";
import useAuthStore from "../../store/authSlice/authSlice";
import axiosInstance from "../../axios/axiosConfig";
const cookies = new Cookies(null, { path: "/" });

const SignUp = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { user, setUser } = useAuthStore((state) => state);

  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Route protection if log In is true
  useEffect(() => {
    const token = cookies.get("authToken");
    if (token || user) {
      navigate("/");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/user/register`, {
        ...data,
      });

      //   console.log(res);
      toast.success(res?.data?.message || "Success");
      cookies.set("authToken", res?.data?.token);
      setUser({
        user: res?.data?.user,
        accessToken: res?.data?.token,
      });
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLoginFailure = async (error) => {
    toast.error("Something went wrong please try again");
    console.log(error);
  };

  const handleGoogleLoginSuccess = async (response) => {
    console.log(response);
    if (!response.credential) return console.log("Login Failed");
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/user/gsignin`, {
        tokenId: response.credential,
      });

      toast.success(res?.data?.message || "Success");
      cookies.set("authToken", res?.data?.token);
      setUser({
        user: res?.data?.user,
        accessToken: res?.data?.token,
      });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="">
      {/* <div className="fixed z-50 top-0 w-full bg-white dark:bg-stone-900">
        <Navbar />
      </div> */}

      <div className="p-4 bg-white dark:bg-stone-900   flex-1 w-full flex justify-center items-center">
        <div
          className="py-12 md:px-5 p-3 bg-white dark:bg-stone-900  dark:text-gray-100 rounded-2xl mt-20 max-sm:mt-16 max-w-[500px] h-fit flex-1   shadow-sm"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 10px" }}
        >
          <h1 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100 my-4">
            Sign Up
          </h1>

          <form className="w-full " onSubmit={(e) => handleSubmit(e)}>
            <input
              className="w-full my-2 p-2 px-3 outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 "
              type="text"
              onChange={handleChange}
              name="name"
              placeholder="Full Name"
              required
            />
            <br />
            <input
              className="w-full my-2 p-2 px-3  outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 "
              type="email"
              onChange={handleChange}
              name="email"
              placeholder="Email"
              required
            />

            <PasswordInp
              onChange={handleChange}
              placeholder={"Password"}
              name={"password"}
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 rounded-full inline-flex justify-center  mx-auto w-full mt-3 max-w-[500px] hover:bg-blue-400 text-white p-1 py-2 px-3"
            >
              {loading ? <Loader /> : "Sign Up"}
            </button>

            <div className="text-center my-4 gap-1 flex items-center justify-center text-xs dark:text-gray-100">
              Already Having an Account?{" "}
              <Link to="/login" className="text-blue-900  font-semibold">
                Login here
              </Link>
            </div>
          </form>

          <div className="text-center my-4 gap-4 flex items-center ">
            <div className="h-[1px] flex-1 dark:bg-stone-800 bg-stone-300 "></div>
            or
            <div className="h-[1px] flex-1 dark:bg-stone-800 bg-stone-300 "></div>
          </div>
          <div className="md:w-[450px] max-sm:w-[260px] border-none  rounded-full mx-auto">
            <div className="mt-4  rounded-full dark:bg-stone-800">
              <GoogleLogin
                theme={"filled_white"}
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
