import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

const STATUS_OPTIONS = ["Pending", "In Progress", "Found", "Unavailable"];

function PartRequests() {
  const role = localStorage.getItem("role");
  const isCustomer = role === "Customer";

  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ partName: "", description: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      const endpoint = isCustomer ? "/part-requests/my" : "/part-requests";
      const res = await axiosClient.get(endpoint);
      setRequests(res.data);
    } catch {
      setMessage("Failed to load part requests.");
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axiosClient.post("/part-requests", {
        partName: form.partName,
        description: form.description,
      });
      setMessage("Part request submitted successfully.");
      setShowForm(false);
      setForm({ partName: "", description: "" });
      fetchRequests();
    } catch (err) {
      setMessage(err.response?.data || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosClient.patch(`/part-requests/${id}/status`, { status });
      fetchRequests();
    } catch {
      setMessage("Failed to update status.");
    }
  };

  const statusColor = (s) => {
    if (s === "Found") return "#16a34a";
    if (s === "In Progress") return "#2563eb";
    if (s === "Unavailable") return "#dc2626";
    return "#d97706";
  };

  return (
    <DashboardLayout title="Part Requests">
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={styles.cardTitle}>Part Requests ({requests.length})</h3>
            {isCustomer && (
              <button style={styles.btn} onClick={() => { setShowForm(!showForm); setMessage(""); }}>
                {showForm ? "Cancel" : "+ Request a Part"}
              </button>
            )}
          </div>

          {message && <p style={styles.msg}>{message}</p>}

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.formBox}>
              <h4 style={{ margin: "0 0 12px" }}>Request Unavailable Part</h4>
              <input
                style={styles.input}
                placeholder="Part name"
                value={form.partName}
                onChange={e => setForm({ ...form, partName: e.target.value })}
                required
              />
              <textarea
                style={{ ...styles.input, minHeight: "70px", resize: "vertical" }}
                placeholder="Describe the part (brand, model compatibility, part number if known)..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}

          {requests.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No part requests found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {!isCustomer && <th style={styles.th}>Customer</th>}
                  <th style={styles.th}>Part Name</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Status</th>
                  {!isCustomer && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.id}>
                    {!isCustomer && <td style={styles.td}>{r.customerName}</td>}
                    <td style={styles.td}><strong>{r.partName}</strong></td>
                    <td style={styles.td}>{r.description || "—"}</td>
                    <td style={styles.td}>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: statusColor(r.status) }}>{r.status}</span>
                    </td>
                    {!isCustomer && (
                      <td style={styles.td}>
                        <select
                          style={styles.selectSmall}
                          value={r.status}
                          onChange={e => handleStatusChange(r.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    )}
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
  cardTitle: { margin: 0, color: "#111827" },
  formBox: { background: "#f9fafb", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" },
  btn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  msg: { color: "#dc2626", marginBottom: "12px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#374151", fontSize: "13px" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { color: "white", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  selectSmall: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px", cursor: "pointer" },
};

export default PartRequests;
