import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./modules/auth/Login";
import AdminLogin from "./modules/adminAuth/Login";
import AdminDashboard from "./modules/admin_dashboard/AdminDashboard";
import HomePage from "./modules/home/pages/HomePage";
import "leaflet/dist/leaflet.css";
// import MapComponent from './components/LeafletMap/LeafLetmap';
import MultiplePointsMap from "./components/LeafletMap/MultiplePointsMap";
import ReportDetails from "./modules/ReportDetails/ReportDetails";

// import other components like Login, Home, etc. when available

const routes = [
  {
    path:'/',
    element:<HomePage/>
  },
  {
    path:'/report/:reportId',
    element:<ReportDetails/>
  }
]

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
        <Route path="/admin/dashboard" element={<ReportDetails />}>
          <Route path="stats" element={<HomePage />} />
        </Route>

        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
