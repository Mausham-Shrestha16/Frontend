import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function CustomerDashboard() {
  return (
    <DashboardLayout title="Customer Dashboard">
      <div style={styles.grid}>
        <Link to="/customer-profile" style={styles.cardLink}>
          <div style={styles.card}>
            <h3>My Profile</h3>
            <p>View and update your profile and vehicle information.</p>
            <span style={styles.action}>Open Profile →</span>
          </div>
        </Link>

        <Link to="/customer-history" style={styles.cardLink}>
          <div style={styles.card}>
            <h3>My Purchase History</h3>
            <p>View your invoices, purchased items, paid amount, and credit balance.</p>
            <span style={styles.action}>View History →</span>
          </div>
        </Link>

        <div style={styles.card}>
          <h3>Appointments</h3>
          <p>Appointment booking will be added after the service module is completed.</p>
          <button style={styles.disabledButton} disabled>
            Coming Soon
          </button>
        </div>

        <div style={styles.card}>
          <h3>Service Reviews</h3>
          <p>Review and service request features will be integrated later.</p>
          <button style={styles.disabledButton} disabled>
            Coming Soon
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  cardLink: {
    textDecoration: "none",
    color: "inherit",
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    minHeight: "170px",
  },
  action: {
    display: "inline-block",
    marginTop: "14px",
    color: "#2563eb",
    fontWeight: "600",
  },
  disabledButton: {
    marginTop: "14px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#d1d5db",
    color: "#374151",
    cursor: "not-allowed",
  },
};

export default CustomerDashboard;