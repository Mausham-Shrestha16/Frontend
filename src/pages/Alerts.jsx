import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function Alerts() {
  const [lowStock, setLowStock] = useState(null);
  const [overdueCredit, setOverdueCredit] = useState(null);
  const [emailMsg, setEmailMsg] = useState("");
  const [loading, setLoading] = useState({});

  const fetchAlerts = async () => {
    try {
      const [lsRes, ocRes] = await Promise.all([
        axiosClient.get("/alerts/low-stock"),
        axiosClient.get("/alerts/overdue-credit"),
      ]);
      setLowStock(lsRes.data);
      setOverdueCredit(ocRes.data);
    } catch {
      setEmailMsg("Failed to load alerts.");
    }
  };

  useEffect(() => { fetchAlerts(); }, []);

  const sendEmail = async (type) => {
    setLoading(l => ({ ...l, [type]: true }));
    setEmailMsg("");
    try {
      await axiosClient.post(`/alerts/${type}/send-email`);
      setEmailMsg(type === "low-stock" ? "Low stock alert email sent to admin." : "Overdue credit reminder emails sent to customers.");
    } catch {
      setEmailMsg("Failed to send emails. Check your email settings in appsettings.json.");
    } finally {
      setLoading(l => ({ ...l, [type]: false }));
    }
  };

  return (
    <DashboardLayout title="Alerts & Reminders">
      <div style={styles.container}>
        {emailMsg && <div style={styles.notice}>{emailMsg}</div>}

        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={styles.cardTitle}>
              Low Stock Parts
              {lowStock && <span style={{ ...styles.badge, background: lowStock.count > 0 ? "#dc2626" : "#16a34a" }}>{lowStock.count}</span>}
            </h3>
            <button style={{ ...styles.btn, background: "#dc2626" }} onClick={() => sendEmail("low-stock")} disabled={loading["low-stock"]}>
              {loading["low-stock"] ? "Sending..." : "Send Email Alert"}
            </button>
          </div>

          {!lowStock ? <p style={{ color: "#6b7280" }}>Loading...</p> :
            lowStock.parts.length === 0 ? <p style={{ color: "#16a34a" }}>All parts are sufficiently stocked.</p> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Part #</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Reorder Level</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.parts.map(p => (
                    <tr key={p.id}>
                      <td style={styles.td}>{p.partNumber}</td>
                      <td style={styles.td}>{p.name}</td>
                      <td style={styles.td}>{p.category}</td>
                      <td style={{ ...styles.td, color: "#dc2626", fontWeight: "bold" }}>{p.stockQuantity}</td>
                      <td style={styles.td}>{p.reorderLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>

        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={styles.cardTitle}>
              Overdue Credit Customers
              {overdueCredit && <span style={{ ...styles.badge, background: overdueCredit.count > 0 ? "#f59e0b" : "#16a34a" }}>{overdueCredit.count}</span>}
            </h3>
            <button style={{ ...styles.btn, background: "#f59e0b" }} onClick={() => sendEmail("overdue-credit")} disabled={loading["overdue-credit"]}>
              {loading["overdue-credit"] ? "Sending..." : "Send Reminders"}
            </button>
          </div>

          {!overdueCredit ? <p style={{ color: "#6b7280" }}>Loading...</p> :
            overdueCredit.customers.length === 0 ? <p style={{ color: "#16a34a" }}>No overdue credits.</p> : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Customer</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Outstanding</th>
                    <th style={styles.th}>Invoices</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueCredit.customers.map(c => (
                    <tr key={c.customerId}>
                      <td style={styles.td}>{c.fullName}</td>
                      <td style={styles.td}>{c.email}</td>
                      <td style={styles.td}>{c.phoneNumber}</td>
                      <td style={{ ...styles.td, color: "#dc2626", fontWeight: "bold" }}>${c.totalCredit.toFixed(2)}</td>
                      <td style={styles.td}>{c.overdueInvoiceCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "24px" },
  card: { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  cardTitle: { margin: 0, color: "#111827", display: "flex", alignItems: "center", gap: "10px" },
  badge: { color: "white", padding: "2px 10px", borderRadius: "12px", fontSize: "13px" },
  btn: { padding: "10px 20px", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  notice: { background: "#eff6ff", border: "1px solid #bfdbfe", padding: "12px 16px", borderRadius: "8px", color: "#1e40af" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#374151", fontSize: "13px" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
};

export default Alerts;
