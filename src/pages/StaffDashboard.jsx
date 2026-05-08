import DashboardLayout from "../components/DashboardLayout";

function StaffDashboard() {
  return (
    <DashboardLayout title="Staff Dashboard">
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Customer Registration</h3>
          <p>Staff can register new customers with vehicle information.</p>
        </div>

        <div style={styles.card}>
          <h3>Customer Search</h3>
          <p>Search and view customer details.</p>
        </div>

        <div style={styles.card}>
          <h3>Sales Invoice</h3>
          <p>Create and manage sales invoices after integration.</p>
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
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
};

export default StaffDashboard;