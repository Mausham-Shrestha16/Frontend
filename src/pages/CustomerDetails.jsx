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
          <p>
            <strong>Name:</strong> {customer.fullName}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phoneNumber}
          </p>
          <p>
            <strong>Address:</strong> {customer.address}
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <p>
            <strong>Total Vehicles:</strong> {customer.vehicles?.length || 0}
          </p>
          <p>
            <strong>Total Purchase Records:</strong>{" "}
            {customer.purchaseHistory?.length || 0}
          </p>
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
                    <td style={styles.td}>{vehicle.year}</td>
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
          <p style={styles.empty}>
            No purchase history available yet. This section will show invoice
            history after the sales invoice module is integrated.
          </p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Invoice No.</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Paid</th>
                  <th style={styles.th}>Credit</th>
                </tr>
              </thead>

              <tbody>
                {customer.purchaseHistory.map((invoice) => (
                  <tr key={invoice.invoiceId}>
                    <td style={styles.td}>{invoice.invoiceNumber}</td>
                    <td style={styles.td}>{invoice.invoiceDate}</td>
                    <td style={styles.td}>{invoice.totalAmount}</td>
                    <td style={styles.td}>{invoice.paidAmount}</td>
                    <td style={styles.td}>{invoice.creditAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
  empty: {
    color: "#6b7280",
  },
  error: {
    color: "#dc2626",
  },
};

export default CustomerDetails;