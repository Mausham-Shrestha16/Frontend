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
      <div style={styles.card}>
        <h1 style={styles.title}>Vehicle Parts System</h1>
        <p style={styles.subtitle}>Login to continue</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div>
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
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          New customer?{" "}
          <span style={styles.link} onClick={() => navigate("/register")}>
            Register here
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
  },
  card: {
    width: "380px",
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
    marginBottom: "24px",
    color: "#6b7280",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#374151",
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
    marginTop: "8px",
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
  demoBox: {
    marginTop: "18px",
    padding: "12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    color: "#4b5563",
    fontSize: "13px",
    textAlign: "center",
  },
};

export default Login;