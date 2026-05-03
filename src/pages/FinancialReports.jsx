import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function FinancialReports() {
  const [mode, setMode] = useState("monthly");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      let url = "";
      if (mode === "daily") url = `/reports/financial/daily?date=${date}`;
      else if (mode === "monthly") url = `/reports/financial/monthly?year=${year}&month=${month}`;
      else url = `/reports/financial/yearly?year=${year}`;

      const res = await axiosClient.get(url);
      setReport(res.data);
    } catch {
      setError("Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <DashboardLayout title="Financial Reports">
      <div style={styles.container}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Generate Report</h3>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <div>
              <label style={styles.label}>Report Type</label>
              <select style={styles.input} value={mode} onChange={e => setMode(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {mode === "daily" && (
              <div>
                <label style={styles.label}>Date</label>
                <input style={styles.input} type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            )}

            {(mode === "monthly" || mode === "yearly") && (
              <div>
                <label style={styles.label}>Year</label>
                <input style={styles.input} type="number" value={year} onChange={e => setYear(e.target.value)} min="2000" max="2100" />
              </div>
            )}

            {mode === "monthly" && (
              <div>
                <label style={styles.label}>Month</label>
                <select style={styles.input} value={month} onChange={e => setMonth(e.target.value)}>
                  {months.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
              </div>
            )}

            <button style={styles.btn} onClick={fetchReport} disabled={loading}>
              {loading ? "Loading..." : "Generate"}
            </button>
          </div>
          {error && <p style={styles.msg}>{error}</p>}
        </div>

        {report && (
          <>
            <div style={styles.grid}>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Revenue</p>
                <p style={styles.statValue}>${report.totalRevenue.toFixed(2)}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Paid</p>
                <p style={{ ...styles.statValue, color: "#16a34a" }}>${report.totalPaid.toFixed(2)}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Credit</p>
                <p style={{ ...styles.statValue, color: "#dc2626" }}>${report.totalCredit.toFixed(2)}</p>
              </div>
              <div style={styles.statCard}>
                <p style={styles.statLabel}>Total Invoices</p>
                <p style={styles.statValue}>{report.totalInvoices}</p>
              </div>
            </div>

            {report.breakdown.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Breakdown</h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Period</th>
                      <th style={styles.th}>Invoices</th>
                      <th style={styles.th}>Revenue</th>
                      <th style={styles.th}>Paid</th>
                      <th style={styles.th}>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.breakdown.map((row, i) => (
                      <tr key={i}>
                        <td style={styles.td}>{row.period}</td>
                        <td style={styles.td}>{row.invoiceCount}</td>
                        <td style={styles.td}>${row.revenue.toFixed(2)}</td>
                        <td style={styles.td}>${row.paid.toFixed(2)}</td>
                        <td style={{ ...styles.td, color: row.credit > 0 ? "#dc2626" : "#16a34a" }}>${row.credit.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {report.breakdown.length === 0 && (
              <div style={styles.card}>
                <p style={{ color: "#6b7280" }}>No invoices found for this period.</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "24px" },
  card: { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  cardTitle: { margin: "0 0 16px", color: "#111827" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" },
  statCard: { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  statLabel: { margin: "0 0 8px", color: "#6b7280", fontSize: "14px" },
  statValue: { margin: 0, fontSize: "28px", fontWeight: "bold", color: "#2563eb" },
  label: { display: "block", marginBottom: "4px", fontSize: "13px", color: "#374151" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" },
  btn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  msg: { color: "#dc2626", marginTop: "12px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#374151", fontSize: "13px" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
};

export default FinancialReports;
