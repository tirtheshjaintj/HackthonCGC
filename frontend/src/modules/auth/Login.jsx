import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Link, useNavigate } from "react-router-dom";
import PasswordInp from "../../components/Auths/PasswordInp";
import Loader from "../../components/Loader"
import useAuthStore from "../../store/authSlice/authSlice";
import { getCookie, setCookie } from "../../axios/cookieFunc";
import axiosInstance from "../../axios/axiosConfig";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const { user, setUser } = useAuthStore((state) => state);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  useEffect(() => {
    const token = getCookie("authToken");
    if (user || token) {
      navigate("/");
    }
  }, []);

  const handleGoogleLoginFailure = async (error) => {
    toast.error("Something went wrong please try again");
    console.log(error);
  };
  const handleGoogleLoginSuccess = async (response) => {
    if (!response.credential) return console.log("Login Failed");
    try {
      setLoading(true);
      const res = await axiosInstance.post(`/user/gsignin`, {
        tokenId: response.credential,
      });

      toast.success(res?.data.message || "Success");

      setCookie("authToken", res?.data?.token);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/user/login`, {
        ...data,
      });
      toast.success(res?.data?.message || "Success");
      console.log(res);
      setCookie("authToken", res?.data?.token);
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
  return (
    <div className="">
      {/* <div className="fixed  z-50  top-0 w-full bg-white dark:bg-stone-900">
        <Navbar />
      </div> */}

      <div className="p-4 bg-white dark:bg-stone-900   flex-1 w-full flex justify-center items-center">
        <div
          className="py-12 md:px-5 p-3 bg-white dark:bg-stone-900  dark:text-gray-100 rounded-2xl mt-20 max-sm:mt-16 max-w-[500px] h-fit flex-1   shadow-sm"
          style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 2px 10px" }}
        >
          <h1 className="text-center text-2xl font-bold text-gray-800 dark:text-gray-100 my-4">
            Welcome Back 👋
          </h1>

          <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
            <input
              className="w-full my-2 p-2 px-3  outline-none rounded-md bg-gray-50 dark:bg-stone-800 dark:text-gray-50 "
              type="text"
              autoComplete="off"
              onChange={handleChange}
              name="email"
              id="email"
              placeholder="Email"
              required
            />

            <PasswordInp
              onChange={handleChange}
              placeholder={"Password"}
              name={"password"}
            />
            <Link
              to="/forgot/password"
              className="text-blue-800 text-xs px-2 font-semibold"
            >
              Forgot password ?
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 rounded-full inline-flex justify-center  mx-auto w-full mt-3 max-w-[500px] hover:bg-blue-400 text-white p-1 py-2 px-3"
            >
              {loading ? <Loader /> : "Log In"}
            </button>

            <div className="text-center my-4 gap-1 flex items-center justify-center text-xs dark:text-gray-100">
              Not Having Account?{" "}
              <Link to="/signup" className="text-blue-800 font-semibold">
                SignUp here
              </Link>{" "}
            </div>
          </form>

          <div className="text-center my-4 gap-4 flex items-center ">
            <div className="h-[1px] flex-1 dark:bg-stone-800 bg-stone-300 "></div>
            or
            <div className="h-[1px] flex-1 dark:bg-stone-800 bg-stone-300 "></div>
          </div>

          <GoogleOAuthProvider clientId="702829994495-pfp4ughca3dhaio31i8qj372b9rg595f.apps.googleusercontent.com">
            <div className="md:w-[450px] min-w-full max-sm:w-[260px] border-none  rounded-full mx-auto">
              <div className="mt-4  rounded-full dark:bg-stone-800">
                <GoogleLogin
                  theme={"filled_white"}
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                />
              </div>
            </div>
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Login;
