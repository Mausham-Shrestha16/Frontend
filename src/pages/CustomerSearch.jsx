import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function CustomerSearch() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!keyword.trim()) {
      setError("Please enter name, phone, email, customer ID, or vehicle number.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.get(
        `/customers/search?keyword=${encodeURIComponent(keyword)}`
      );

      setCustomers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Customer search failed.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Customer Search">
      <div style={styles.card}>
        <form onSubmit={handleSearch} style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by name, phone, email, ID, or vehicle number"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Search Results</h2>

        {customers.length === 0 ? (
          <p style={styles.empty}>No customers found yet.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Customer ID</th>
                  <th style={styles.th}>Full Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Vehicle Number</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td style={styles.td}>{customer.customerId}</td>
                    <td style={styles.td}>{customer.fullName}</td>
                    <td style={styles.td}>{customer.email}</td>
                    <td style={styles.td}>{customer.phoneNumber}</td>
                    <td style={styles.td}>{customer.vehicleNumber}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.smallButton}
                        onClick={() =>
                          navigate(`/customer-details/${customer.customerId}`)
                        }
                      >
                        View Details
                      </button>
                    </td>
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
  card: {
    background: "white",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    marginBottom: "22px",
  },
  searchBox: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },
  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "#dc2626",
    marginTop: "12px",
  },
  sectionTitle: {
    marginTop: 0,
    color: "#111827",
  },
  empty: {
    color: "#6b7280",
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
  smallButton: {
    background: "#111827",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default CustomerSearch;