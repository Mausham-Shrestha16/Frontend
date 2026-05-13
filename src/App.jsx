import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import RegisterCustomer from "./pages/RegisterCustomer.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import CustomerSearch from "./pages/CustomerSearch.jsx";
import CustomerDetails from "./pages/CustomerDetails.jsx";
import CustomerReport from "./pages/CustomerReport.jsx";
import CustomerProfile from "./pages/CustomerProfile.jsx";
import CustomerHistory from "./pages/CustomerHistory.jsx";
import StaffManagement from "./pages/StaffManagement.jsx";
import PartsManagement from "./pages/PartsManagement.jsx";
import PurchaseInvoices from "./pages/PurchaseInvoices.jsx";
import VendorManagement from "./pages/VendorManagement.jsx";
import SalesInvoices from "./pages/SalesInvoices.jsx";
import FinancialReports from "./pages/FinancialReports.jsx";
import Alerts from "./pages/Alerts.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterCustomer />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />

        <Route path="/customer-profile" element={<CustomerProfile />} />
        <Route path="/customer-history" element={<CustomerHistory />} />

        <Route path="/customer-search" element={<CustomerSearch />} />
        <Route path="/customer-details/:id" element={<CustomerDetails />} />
        <Route path="/customer-report" element={<CustomerReport />} />

        <Route path="/staff-management" element={<StaffManagement />} />
        <Route path="/parts-management" element={<PartsManagement />} />
        <Route path="/purchase-invoices" element={<PurchaseInvoices />} />
        <Route path="/vendor-management" element={<VendorManagement />} />

        <Route path="/sales-invoices" element={<SalesInvoices />} />
        <Route path="/financial-reports" element={<FinancialReports />} />
        <Route path="/alerts" element={<Alerts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;