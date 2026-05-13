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

  const formatMoney = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  const renderCustomerTable = (title, customers, emptyText) => {
    return (
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>{title}</h3>

        {!customers || customers.length === 0 ? (
          <p style={styles.empty}>{emptyText}</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Invoices</th>
                  <th style={styles.th}>Total Spent</th>
                  <th style={styles.th}>Pending Credit</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td style={styles.td}>{customer.customerId}</td>
                    <td style={styles.td}>{customer.fullName}</td>
                    <td style={styles.td}>{customer.email}</td>
                    <td style={styles.td}>{customer.phoneNumber}</td>
                    <td style={styles.td}>{customer.invoiceCount}</td>
                    <td style={styles.td}>{formatMoney(customer.totalSpent)}</td>
                    <td style={styles.td}>
                      <span
                        style={
                          customer.pendingCreditAmount > 0
                            ? styles.creditBadge
                            : styles.clearBadge
                        }
                      >
                        {formatMoney(customer.pendingCreditAmount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout title="Customer Report">
      {error ? (
        <div style={styles.error}>{error}</div>
      ) : !report ? (
        <div style={styles.card}>
          <p style={styles.empty}>Loading report...</p>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3>Total Customers</h3>
              <p style={styles.number}>{report.totalCustomers}</p>
            </div>

            <div style={styles.card}>
              <h3>Regular Customers</h3>
              <p style={styles.number}>{report.regularCustomers}</p>
              <p style={styles.cardHint}>Customers with 3 or more invoices</p>
            </div>

            <div style={styles.card}>
              <h3>High Spenders</h3>
              <p style={styles.number}>{report.highSpenders}</p>
              <p style={styles.cardHint}>Customers who spent Rs. 5,000+</p>
            </div>

            <div style={styles.card}>
              <h3>Pending Credit Customers</h3>
              <p style={styles.number}>{report.pendingCreditCustomers}</p>
              <p style={styles.cardHint}>Customers with unpaid balance</p>
            </div>
          </div>

          {renderCustomerTable(
            "Regular Customer List",
            report.regularCustomerList,
            "No regular customers found yet."
          )}

          {renderCustomerTable(
            "High Spender List",
            report.highSpenderList,
            "No high spender customers found yet."
          )}

          {renderCustomerTable(
            "Pending Credit Customer List",
            report.pendingCreditCustomerList,
            "No pending credit customers found yet."
          )}

          <div style={styles.noteCard}>
            <h3>Report Note</h3>
            <p>
              Regular customers are calculated from invoice count. High spenders
              are calculated from total purchase amount. Pending credit customers
              are calculated from unpaid sales invoice balances.
            </p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
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
  cardHint: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: 0,
  },
  tableCard: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  tableTitle: {
    marginTop: 0,
    color: "#111827",
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
  creditBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "5px 10px",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "13px",
  },
  clearBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "5px 10px",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "13px",
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