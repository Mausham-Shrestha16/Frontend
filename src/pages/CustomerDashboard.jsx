import { useNavigate } from "react-router-dom";

function CustomerDashboard() {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Customer Dashboard</h1>
          <p style={styles.subtitle}>Customer self-service area</p>
        </div>

        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.card}>
        <h2>Welcome, {fullName}</h2>
        <p>Email: {email}</p>
        <p>Role: {role}</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.box}>
          <h3>Profile Management</h3>
          <p>Customers can manage their profile and vehicle details.</p>
        </div>

        <div style={styles.box}>
          <h3>Book Appointment</h3>
          <p>Customers can book service appointments.</p>
        </div>

        <div style={styles.box}>
          <h3>Purchase History</h3>
          <p>Customers can view their purchase and service history.</p>
        </div>

        <div style={styles.box}>
          <h3>Loyalty Program</h3>
          <p>Customers can receive discounts based on purchases.</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
    padding: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  title: {
    margin: 0,
    color: "#111827",
  },
  subtitle: {
    color: "#6b7280",
    marginTop: "5px",
  },
  logoutButton: {
    padding: "10px 18px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  box: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};

export default CustomerDashboard;