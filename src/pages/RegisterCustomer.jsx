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
        <h1 style={styles.title}>Customer Registration</h1>
        <p style={styles.subtitle}>Create your account with vehicle details</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRegister} style={styles.form}>
          <h3 style={styles.sectionTitle}>Personal Details</h3>

          <input
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <h3 style={styles.sectionTitle}>Vehicle Details</h3>

          <input
            name="vehicleNumber"
            placeholder="Vehicle Number e.g. BA 12 PA 1234"
            value={formData.vehicleNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="vehicleType"
            placeholder="Vehicle Type e.g. Car, Bike"
            value={formData.vehicleType}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="brand"
            placeholder="Brand e.g. Toyota"
            value={formData.brand}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="model"
            placeholder="Model e.g. Corolla"
            value={formData.model}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            name="year"
            type="number"
            placeholder="Year e.g. 2020"
            value={formData.year}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Registering..." : "Register"}
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
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    padding: "30px",
  },
  card: {
    width: "500px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    color: "#111827",
    textAlign: "center",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: "20px",
    color: "#6b7280",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    margin: "10px 0 0",
    color: "#1f2937",
    fontSize: "17px",
  },
  input: {
    width: "100%",
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    background: "#1f2937",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  footerText: {
    marginTop: "18px",
    textAlign: "center",
    color: "#4b5563",
  },
  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default RegisterCustomer;