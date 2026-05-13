import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function CustomerDetails() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    setError("");

    try {
      const response = await axiosClient.get(`/customers/${id}`);
      setCustomer(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load customer details.");
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";
    return new Date(dateValue).toLocaleDateString();
  };

  const formatMoney = (value) => {
    return `Rs. ${Number(value || 0).toLocaleString()}`;
  };

  if (error) {
    return (
      <DashboardLayout title="Customer Details">
        <div style={styles.card}>
          <p style={styles.error}>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout title="Customer Details">
        <div style={styles.card}>
          <p style={styles.empty}>Loading customer details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Customer Details">
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Customer Information</h2>
          <p><strong>Name:</strong> {customer.fullName}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phoneNumber}</p>
          <p><strong>Address:</strong> {customer.address}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <p><strong>Total Vehicles:</strong> {customer.vehicles?.length || 0}</p>
          <p><strong>Total Purchase Records:</strong> {customer.purchaseHistory?.length || 0}</p>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Vehicle Information</h2>

        {!customer.vehicles || customer.vehicles.length === 0 ? (
          <p style={styles.empty}>No vehicle details found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Vehicle Number</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Brand</th>
                  <th style={styles.th}>Model</th>
                  <th style={styles.th}>Year</th>
                </tr>
              </thead>

              <tbody>
                {customer.vehicles.map((vehicle) => (
                  <tr key={vehicle.vehicleId}>
                    <td style={styles.td}>{vehicle.vehicleNumber}</td>
                    <td style={styles.td}>{vehicle.vehicleType}</td>
                    <td style={styles.td}>{vehicle.brand}</td>
                    <td style={styles.td}>{vehicle.model}</td>
                    <td style={styles.td}>{vehicle.year || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Purchase History</h2>

        {!customer.purchaseHistory || customer.purchaseHistory.length === 0 ? (
          <p style={styles.empty}>No purchase history available yet.</p>
        ) : (
          <div style={styles.invoiceList}>
            {customer.purchaseHistory.map((invoice) => (
              <div key={invoice.invoiceId} style={styles.invoiceCard}>
                <div style={styles.invoiceHeader}>
                  <div>
                    <h3 style={styles.invoiceTitle}>{invoice.invoiceNumber}</h3>
                    <p style={styles.invoiceDate}>{formatDate(invoice.invoiceDate)}</p>
                  </div>

                  <div style={styles.invoiceAmountBox}>
                    <p style={styles.amountLabel}>Total</p>
                    <p style={styles.amountValue}>{formatMoney(invoice.totalAmount)}</p>
                  </div>
                </div>

                <div style={styles.paymentGrid}>
                  <div style={styles.paymentItem}>
                    <span style={styles.paymentLabel}>Paid</span>
                    <strong>{formatMoney(invoice.paidAmount)}</strong>
                  </div>

                  <div style={styles.paymentItem}>
                    <span style={styles.paymentLabel}>Credit</span>
                    <strong style={invoice.creditAmount > 0 ? styles.creditText : styles.paidText}>
                      {formatMoney(invoice.creditAmount)}
                    </strong>
                  </div>
                </div>

                <h4 style={styles.itemTitle}>Purchased Items</h4>

                {!invoice.items || invoice.items.length === 0 ? (
                  <p style={styles.empty}>No item details found for this invoice.</p>
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
      </div>
    </DashboardLayout>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "22px",
  },
  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "22px",
  },
  sectionTitle: {
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
  invoiceList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  invoiceCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    background: "#f9fafb",
  },
  invoiceHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  invoiceTitle: {
    margin: 0,
    color: "#111827",
  },
  invoiceDate: {
    margin: "6px 0 0",
    color: "#6b7280",
  },
  invoiceAmountBox: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 14px",
    minWidth: "150px",
  },
  amountLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "13px",
  },
  amountValue: {
    margin: "4px 0 0",
    fontWeight: "bold",
    color: "#2563eb",
    fontSize: "20px",
  },
  paymentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "14px",
  },
  paymentItem: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px",
  },
  paymentLabel: {
    display: "block",
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "4px",
  },
  itemTitle: {
    marginBottom: "10px",
    color: "#374151",
  },
  creditText: {
    color: "#dc2626",
  },
  paidText: {
    color: "#16a34a",
  },
  empty: {
    color: "#6b7280",
  },
  error: {
    color: "#dc2626",
  },
};

export default CustomerDetails;