import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function CustomerReport() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setError("");

    try {
      const response = await axiosClient.get("/reports/customers");
      setReport(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customer report.");
    }
  };

  return (
    <DashboardLayout title="Customer Report">
      {error && <div style={styles.error}>{error}</div>}

      {!report ? (
        <div style={styles.card}>
          <p style={styles.empty}>Loading report...</p>
        </div>
      ) : (
        <div style={styles.grid}>
          <div style={styles.card}>
            <h3>Total Customers</h3>
            <p style={styles.number}>{report.totalCustomers}</p>
          </div>

          <div style={styles.card}>
            <h3>Regular Customers</h3>
            <p style={styles.number}>{report.regularCustomers}</p>
          </div>

          <div style={styles.card}>
            <h3>High Spenders</h3>
            <p style={styles.number}>{report.highSpenders}</p>
          </div>

          <div style={styles.card}>
            <h3>Pending Credit Customers</h3>
            <p style={styles.number}>{report.pendingCreditCustomers}</p>
          </div>
        </div>
      )}

      <div style={styles.noteCard}>
        <h3>Report Note</h3>
        <p>
          Total customer count is generated from customer records. Regular
          customer, high spender, and pending credit values will become more
          meaningful after the sales invoice module is fully integrated.
        </p>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  number: {
    fontSize: "38px",
    fontWeight: "bold",
    color: "#2563eb",
    margin: 0,
  },
  noteCard: {
    marginTop: "24px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    padding: "20px",
    borderRadius: "12px",
    color: "#1e3a8a",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  empty: {
    color: "#6b7280",
  },
};

export default CustomerReport;