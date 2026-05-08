import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosClient.post("/auth/login", formData);

      const { token, fullName, email, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("fullName", fullName);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);

      if (role === "Admin") {
        navigate("/admin-dashboard");
      } else if (role === "Staff") {
        navigate("/staff-dashboard");
      } else if (role === "Customer") {
        navigate("/customer-dashboard");
      } else {
        setError("Unknown user role.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <h1 style={styles.brand}>Vehicle Parts Inventory System</h1>
        <p style={styles.brandText}>
          Manage customers, vehicles, parts, invoices, reports, and service activities from one system.
        </p>
      </div>

      <div style={styles.rightPanel}>
        <form onSubmit={handleLogin} style={styles.card}>
          <h2 style={styles.title}>Login</h2>
          <p style={styles.subtitle}>Enter your credentials to continue</p>

          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="admin@vehicleparts.com"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={styles.footerText}>
            New customer?{" "}
            <span style={styles.link} onClick={() => navigate("/register")}>
              Register here
            </span>
          </p>


        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "Arial, sans-serif",
    background: "#f3f4f6",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #111827, #1d4ed8)",
    color: "white",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brand: {
    fontSize: "42px",
    margin: 0,
    lineHeight: "1.2",
  },
  brandText: {
    marginTop: "20px",
    fontSize: "18px",
    lineHeight: "1.6",
    maxWidth: "520px",
    color: "#e5e7eb",
  },
  rightPanel: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
  card: {
    width: "400px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },
  title: {
    margin: 0,
    color: "#111827",
    fontSize: "28px",
  },
  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
    marginBottom: "24px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box",
    marginBottom: "16px",
  },
  button: {
    width: "100%",
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
    fontSize: "14px",
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
  demoBox: {
    marginTop: "18px",
    padding: "12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    textAlign: "center",
    color: "#4b5563",
    fontSize: "13px",
  },
};

export default Login;