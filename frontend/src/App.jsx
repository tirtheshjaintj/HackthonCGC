import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './modules/auth/Register';
import VerifyOtp from './modules/auth/VerifyOtp';
import Login from './modules/auth/Login';
import AdminLogin from './modules/adminAuth/Login';
import AdminDashboard from './modules/admin_dashboard/AdminDashboard';
import HomePage from './modules/home/pages/HomePage';
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
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />}>
  <Route path='stats' element={<h1>s</h1>} />
</Route>



        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
