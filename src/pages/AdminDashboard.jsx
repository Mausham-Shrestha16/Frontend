import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div style={styles.grid}>
        <Link to="/customer-search" style={styles.cardLink}>
          <div style={styles.card}>
            <h3>Customer Search</h3>
            <p>Search customers by name, phone, ID, email, or vehicle number.</p>
            <span style={styles.action}>Open Customer Search →</span>
          </div>
        </Link>

        <Link to="/customer-report" style={styles.cardLink}>
          <div style={styles.card}>
            <h3>Customer Reports</h3>
            <p>
              View customer summaries, high spenders, regular customers, and
              pending credits.
            </p>
            <span style={styles.action}>Open Customer Reports →</span>
          </div>
        </Link>

        <div style={styles.card}>
          <h3>Parts Management</h3>
          <p>This module will be handled by the assigned team member.</p>
          <button style={styles.disabledButton} disabled>
            Coming Soon
          </button>
        </div>

        <div style={styles.card}>
          <h3>Sales Invoices</h3>
          <p>This module will be integrated after invoice development.</p>
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
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
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

export default AdminDashboard;