import React, { useRef, useState } from 'react';
import axiosInstance from '../../axios/axiosConfig';
import { useLocation } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { email } = location.state || {};

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      try {
        setLoading(true);
        const response = await axiosInstance.post('/user/verify-otp', {
          email,
          otp: enteredOtp,
        });
        console.log(response.data);
        // You can redirect or show success here
      } catch (error) {
        console.error(error);
        // Handle error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-2">Verify OTP</h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength="1"
                disabled={loading}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 border rounded-lg text-center text-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.some((d) => d === '') || loading}
            className={`w-full flex justify-center items-center gap-2 py-2 rounded-md text-white font-medium transition ${
              otp.every((d) => d !== '') && !loading
                ? 'bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Verify'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
