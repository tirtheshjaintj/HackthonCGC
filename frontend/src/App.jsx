import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/auth/Login";
import AdminLogin from "./modules/adminAuth/Login";
import HomePage from "./modules/home/pages/HomePage";
import SignUp from "./modules/auth/SignUp";
// import other components like Login, Home, etc. when available

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<SignUp />} />
 
        {/* Example routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
