import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./modules/auth/Register";
import VerifyOtp from "./modules/auth/VerifyOtp";
import Login from "./modules/auth/Login";
import HomePage from "./modules/home/pages/HomePage";
// import other components like Login, Home, etc. when available

function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} /> */}

        {/* Example routes */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
