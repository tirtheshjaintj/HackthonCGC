import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import GoogleBox from "../../components/GoogleBox/GoogleBox";
import axiosInstance from "../../axios/axiosConfig";

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  return score;
};

const getSuggestions = (password) => {
  const suggestions = [];
  if (password.length < 8) suggestions.push("Use at least 8 characters.");
  if (!/[A-Z]/.test(password)) suggestions.push("Add an uppercase letter.");
  if (!/[a-z]/.test(password)) suggestions.push("Add a lowercase letter.");
  if (!/\d/.test(password)) suggestions.push("Include a number.");
  if (!/[@$!%*?&]/.test(password))
    suggestions.push("Include a special character.");
  return suggestions;
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/user/register", formData);

      if (response.data) {
        toast.success("Registration successful! Check your email for OTP.");
        navigate("/verify-otp", {
          state: {
            email: formData.email,
          },
        });
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration error");
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const suggestions = getSuggestions(formData.password);
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-600",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create your account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
          />

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
            />
            {/* Strength bar */}
            <div className="w-full h-2 bg-gray-200 rounded mt-2">
              <div
                className={`h-full rounded transition-all duration-300 ${
                  strengthColor[strength - 1] || ""
                }`}
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
            {/* Suggestion list */}
            {formData.password && suggestions.length > 0 && (
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center gap-2 py-3 rounded-lg font-semibold transition ${
              isLoading
                ? "bg-green-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
            }`}
          >
            {isLoading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-400">or</div>

        <GoogleBox setIsLoading={setIsLoading} />
      </div>
    </div>
  );
};

export default Register;
