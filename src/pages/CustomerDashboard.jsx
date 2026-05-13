import DashboardLayout from "../components/DashboardLayout";

function CustomerDashboard() {
  return (
    <DashboardLayout title="Customer Dashboard">
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Profile</h3>
          <p>View and manage your customer profile.</p>
          <button style={styles.disabledButton} disabled>
            Coming Soon
          </button>
        </div>

        <div style={styles.card}>
          <h3>Vehicles</h3>
          <p>View and manage your vehicle information.</p>
          <button style={styles.disabledButton} disabled>
            Coming Soon
          </button>
        </div>

        <div style={styles.card}>
          <h3>Appointments</h3>
          <p>Book service appointments after appointment module integration.</p>
          <button style={styles.disabledButton} disabled>
            Coming Soon
          </button>
        </div>

        <div style={styles.card}>
          <h3>Purchase History</h3>
          <p>View purchase history after customer self-history endpoint is added.</p>
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
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  disabledButton: {
    marginTop: "12px",
    padding: "10px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#d1d5db",
    color: "#374151",
    cursor: "not-allowed",
  },
};

export default CustomerDashboard;