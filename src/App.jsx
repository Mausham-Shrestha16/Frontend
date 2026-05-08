import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import RegisterCustomer from "./pages/RegisterCustomer.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import CustomerSearch from "./pages/CustomerSearch.jsx";
import CustomerDetails from "./pages/CustomerDetails.jsx";
import CustomerReport from "./pages/CustomerReport.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterCustomer />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />

        <Route path="/customer-search" element={<CustomerSearch />} />
        <Route path="/customer-details/:id" element={<CustomerDetails />} />
        <Route path="/customer-report" element={<CustomerReport />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;