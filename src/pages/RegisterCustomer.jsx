import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function RegisterCustomer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    vehicleNumber: "",
    vehicleType: "",
    brand: "",
    model: "",
    year: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      address: formData.address,
      vehicle: {
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year),
      },
    };

    try {
      const response = await axiosClient.post("/auth/register-customer", payload);

      const { token, fullName, email, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);

      navigate("/customer-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Customer Registration</h1>
          <p style={styles.subtitle}>Create a customer account with vehicle details</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister}>
          <h3 style={styles.sectionTitle}>Personal Information</h3>

          <div style={styles.grid}>
            <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} style={styles.input} required />
            <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} required />
            <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} style={styles.input} required />
            <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} style={styles.input} required />
          </div>

          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} style={styles.fullInput} required />

          <h3 style={styles.sectionTitle}>Vehicle Information</h3>

          <div style={styles.grid}>
            <input name="vehicleNumber" placeholder="Vehicle Number" value={formData.vehicleNumber} onChange={handleChange} style={styles.input} required />
            <input name="vehicleType" placeholder="Vehicle Type" value={formData.vehicleType} onChange={handleChange} style={styles.input} required />
            <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} style={styles.input} required />
            <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} style={styles.input} required />
          </div>

          <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} style={styles.fullInput} required />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register Customer"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <span style={styles.link} onClick={() => navigate("/")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "760px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },
  header: {
    textAlign: "center",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },
  sectionTitle: {
    color: "#111827",
    marginTop: "22px",
    marginBottom: "12px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
  },
  input: {
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },
  fullInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    marginTop: "14px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    marginTop: "24px",
    padding: "13px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  footerText: {
    textAlign: "center",
    marginTop: "18px",
    color: "#4b5563",
  },
  link: {
    color: "#2563eb",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default RegisterCustomer;