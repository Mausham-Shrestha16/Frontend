import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", phoneNumber: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await axiosClient.get("/staff");
      setStaffList(res.data);
    } catch {
      setMessage("Failed to load staff list.");
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axiosClient.post("/staff", form);
      setMessage("Staff registered successfully.");
      setForm({ fullName: "", email: "", phoneNumber: "", password: "" });
      fetchStaff();
    } catch (err) {
      setMessage(err.response?.data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (staffId, currentStatus) => {
    try {
      await axiosClient.patch(`/staff/${staffId}/status`, { isActive: !currentStatus });
      fetchStaff();
    } catch {
      setMessage("Failed to update status.");
    }
  };

  return (
    <DashboardLayout title="Staff Management">
      <div style={styles.container}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Register New Staff</h3>
          {message && <p style={styles.msg}>{message}</p>}
          <form onSubmit={handleRegister} style={styles.form}>
            <input style={styles.input} placeholder="Full Name" value={form.fullName}
              onChange={e => setForm({ ...form, fullName: e.target.value })} required />
            <input style={styles.input} type="email" placeholder="Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
            <input style={styles.input} placeholder="Phone Number" value={form.phoneNumber}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })} required />
            <input style={styles.input} type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register Staff"}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Staff Members ({staffList.length})</h3>
          {staffList.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No staff members found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map(s => (
                  <tr key={s.id}>
                    <td style={styles.td}>{s.fullName}</td>
                    <td style={styles.td}>{s.email}</td>
                    <td style={styles.td}>{s.phoneNumber}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: s.isActive ? "#16a34a" : "#dc2626" }}>
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={{ ...styles.actionBtn, background: s.isActive ? "#dc2626" : "#16a34a" }}
                        onClick={() => toggleStatus(s.id, s.isActive)}>
                        {s.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
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
  cardTitle: { margin: "0 0 16px", color: "#111827" },
  form: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" },
  btn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  msg: { color: "#dc2626", marginBottom: "12px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#374151", fontSize: "13px" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" },
  actionBtn: { color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
};

export default StaffManagement;
