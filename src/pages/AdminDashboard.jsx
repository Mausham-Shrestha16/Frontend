import DashboardLayout from "../components/DashboardLayout";

function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Customer Search</h3>
          <p>Search customers by name, phone, ID, email, or vehicle number.</p>
        </div>

        <div style={styles.card}>
          <h3>Customer Reports</h3>
          <p>View customer summaries, high spenders, regular customers, and pending credits.</p>
        </div>

        <div style={styles.card}>
          <h3>Parts Management</h3>
          <p>This module will be handled by the assigned team member.</p>
        </div>

        <div style={styles.card}>
          <h3>Sales Invoices</h3>
          <p>This module will be integrated after invoice development.</p>
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

export default AdminDashboard;