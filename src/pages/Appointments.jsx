import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

const SERVICE_TYPES = ["Oil Change", "Tire Service", "Brake Inspection", "General Inspection", "Battery Replacement", "Other"];
const STATUS_OPTIONS = ["Pending", "Confirmed", "Completed", "Cancelled"];

function Appointments() {
  const role = localStorage.getItem("role");
  const isCustomer = role === "Customer";

  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ appointmentDate: "", serviceType: SERVICE_TYPES[0], notes: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      const endpoint = isCustomer ? "/appointments/my" : "/appointments";
      const res = await axiosClient.get(endpoint);
      setAppointments(res.data);
    } catch {
      setMessage("Failed to load appointments.");
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axiosClient.post("/appointments", {
        appointmentDate: form.appointmentDate,
        serviceType: form.serviceType,
        notes: form.notes,
      });
      setMessage("Appointment booked successfully.");
      setShowForm(false);
      setForm({ appointmentDate: "", serviceType: SERVICE_TYPES[0], notes: "" });
      fetchAppointments();
    } catch (err) {
      setMessage(err.response?.data || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosClient.patch(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch {
      setMessage("Failed to update status.");
    }
  };

  const statusColor = (s) => {
    if (s === "Confirmed") return "#16a34a";
    if (s === "Completed") return "#2563eb";
    if (s === "Cancelled") return "#dc2626";
    return "#d97706";
  };

  return (
    <DashboardLayout title="Appointments">
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={styles.cardTitle}>Appointments ({appointments.length})</h3>
            {isCustomer && (
              <button style={styles.btn} onClick={() => { setShowForm(!showForm); setMessage(""); }}>
                {showForm ? "Cancel" : "+ Book Appointment"}
              </button>
            )}
          </div>

          {message && <p style={styles.msg}>{message}</p>}

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.formBox}>
              <h4 style={{ margin: "0 0 12px" }}>New Appointment</h4>
              <label style={styles.label}>Appointment Date & Time</label>
              <input
                style={styles.input}
                type="datetime-local"
                value={form.appointmentDate}
                onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                required
              />
              <label style={styles.label}>Service Type</label>
              <select
                style={styles.input}
                value={form.serviceType}
                onChange={e => setForm({ ...form, serviceType: e.target.value })}
              >
                {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <label style={styles.label}>Notes (optional)</label>
              <textarea
                style={{ ...styles.input, minHeight: "70px", resize: "vertical" }}
                placeholder="Describe your issue or any special requests..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          )}

          {appointments.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No appointments found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  {!isCustomer && <th style={styles.th}>Customer</th>}
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Service</th>
                  <th style={styles.th}>Notes</th>
                  <th style={styles.th}>Status</th>
                  {!isCustomer && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {appointments.map(a => (
                  <tr key={a.id}>
                    {!isCustomer && <td style={styles.td}>{a.customerName}</td>}
                    <td style={styles.td}>{new Date(a.appointmentDate).toLocaleString()}</td>
                    <td style={styles.td}>{a.serviceType}</td>
                    <td style={styles.td}>{a.notes || "—"}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: statusColor(a.status) }}>{a.status}</span>
                    </td>
                    {!isCustomer && (
                      <td style={styles.td}>
                        <select
                          style={styles.selectSmall}
                          value={a.status}
                          onChange={e => handleStatusChange(a.id, e.target.value)}
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
  formBox: { background: "#f9fafb", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", color: "#374151", fontWeight: "600" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" },
  btn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  msg: { color: "#dc2626", marginBottom: "12px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#374151", fontSize: "13px" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { color: "white", padding: "3px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" },
  selectSmall: { padding: "6px 10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "13px", cursor: "pointer" },
};

export default Appointments;
