import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function CustomerHistory() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.get("/customers/me/history");
      setHistory(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load purchase history.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString();
  };

  const formatMoney = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  return (
    <DashboardLayout title="My Purchase History">
      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <div style={styles.card}>
          <p style={styles.empty}>Loading purchase history...</p>
        </div>
      ) : history.length === 0 ? (
        <div style={styles.card}>
          <p style={styles.empty}>No purchase history found yet.</p>
        </div>
      ) : (
        <div style={styles.invoiceList}>
          {history.map((invoice) => (
            <div key={invoice.invoiceId} style={styles.card}>
              <div style={styles.invoiceHeader}>
                <div>
                  <h2 style={styles.invoiceTitle}>{invoice.invoiceNumber}</h2>
                  <p style={styles.invoiceDate}>{formatDate(invoice.invoiceDate)}</p>
                </div>

                <div style={styles.amountBox}>
                  <span style={styles.amountLabel}>Total</span>
                  <strong style={styles.totalAmount}>
                    {formatMoney(invoice.totalAmount)}
                  </strong>
                </div>
              </div>

              <div style={styles.summaryGrid}>
                <div style={styles.summaryItem}>
                  <span>Paid Amount</span>
                  <strong>{formatMoney(invoice.paidAmount)}</strong>
                </div>

                <div style={styles.summaryItem}>
                  <span>Credit Amount</span>
                  <strong
                    style={
                      invoice.creditAmount > 0
                        ? styles.creditText
                        : styles.clearText
                    }
                  >
                    {formatMoney(invoice.creditAmount)}
                  </strong>
                </div>
              </div>

              <h3 style={styles.sectionTitle}>Purchased Items</h3>

              {!invoice.items || invoice.items.length === 0 ? (
                <p style={styles.empty}>No item details found.</p>
              ) : (
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Part Name</th>
                        <th style={styles.th}>Quantity</th>
                        <th style={styles.th}>Unit Price</th>
                        <th style={styles.th}>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
                      {invoice.items.map((item, index) => (
                        <tr key={`${invoice.invoiceId}-${index}`}>
                          <td style={styles.td}>{item.partName}</td>
                          <td style={styles.td}>{item.quantity}</td>
                          <td style={styles.td}>{formatMoney(item.unitPrice)}</td>
                          <td style={styles.td}>{formatMoney(item.subTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

const styles = {
  invoiceList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  invoiceHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "14px",
    marginBottom: "16px",
  },
  invoiceTitle: {
    margin: 0,
    color: "#111827",
  },
  invoiceDate: {
    margin: "6px 0 0",
    color: "#6b7280",
  },
  amountBox: {
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "10px",
    padding: "12px 16px",
    minWidth: "160px",
  },
  amountLabel: {
    display: "block",
    color: "#1e40af",
    fontSize: "13px",
    marginBottom: "4px",
  },
  totalAmount: {
    color: "#1d4ed8",
    fontSize: "22px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "18px",
  },
  summaryItem: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  },
  sectionTitle: {
    marginTop: 0,
    color: "#374151",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    background: "#f9fafb",
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "14px",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  },
  creditText: {
    color: "#dc2626",
  },
  clearText: {
    color: "#16a34a",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  empty: {
    color: "#6b7280",
  },
};

export default CustomerHistory;