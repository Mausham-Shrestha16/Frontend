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

        <Link to="/appointments" style={styles.cardLink}>
          <div style={styles.card}>
            <h3>Appointments</h3>
            <p>Book a service appointment for your vehicle.</p>
            <span style={styles.action}>Book Appointment →</span>
          </div>
        </Link>

        <Link to="/part-requests" style={styles.cardLink}>
          <div style={styles.card}>
            <h3>Request a Part</h3>
            <p>Can&#39;t find a part? Submit a request and we&#39;ll source it for you.</p>
            <span style={styles.action}>Request Part →</span>
          </div>
        </Link>

        <Link to="/reviews" style={styles.cardLink}>
          <div style={styles.card}>
            <h3>Reviews</h3>
            <p>Share your experience and view your past reviews.</p>
            <span style={styles.action}>Write a Review →</span>
          </div>
        </Link>
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
};

export default CustomerDashboard;