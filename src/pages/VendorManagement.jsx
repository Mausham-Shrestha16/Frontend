import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

const emptyForm = { name: "", contactPerson: "", phone: "", email: "", address: "", isActive: true };

function VendorManagement() {
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem("role");

  const fetchVendors = async () => {
    try {
      const res = await axiosClient.get("/vendors");
      setVendors(res.data);
    } catch {
      setMessage("Failed to load vendors.");
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (editId) {
        await axiosClient.put(`/vendors/${editId}`, form);
        setMessage("Vendor updated successfully.");
      } else {
        await axiosClient.post("/vendors", form);
        setMessage("Vendor added successfully.");
      }
      setForm(emptyForm);
      setEditId(null);
      fetchVendors();
    } catch (err) {
      setMessage(err.response?.data || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vendor) => {
    setEditId(vendor.id);
    setForm({ name: vendor.name, contactPerson: vendor.contactPerson, phone: vendor.phone, email: vendor.email, address: vendor.address, isActive: vendor.isActive });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this vendor? This cannot be undone.")) return;
    try {
      await axiosClient.delete(`/vendors/${id}`);
      setMessage("Vendor deleted.");
      fetchVendors();
    } catch {
      setMessage("Delete failed. Vendor may have linked invoices.");
    }
  };

  const handleCancel = () => { setEditId(null); setForm(emptyForm); setMessage(""); };

  return (
    <DashboardLayout title="Vendor Management">
      <div style={styles.container}>
        {role === "Admin" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>{editId ? "Edit Vendor" : "Add New Vendor"}</h3>
            {message && <p style={styles.msg}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
              <input style={styles.input} placeholder="Vendor Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input style={styles.input} placeholder="Contact Person" value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} />
              <input style={styles.input} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input style={styles.input} type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input style={styles.input} placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              {editId && (
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                  Active
                </label>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={styles.btn} type="submit" disabled={loading}>{loading ? "Saving..." : editId ? "Update Vendor" : "Add Vendor"}</button>
                {editId && <button style={{ ...styles.btn, background: "#6b7280" }} type="button" onClick={handleCancel}>Cancel</button>}
              </div>
            </form>
          </div>
        )}

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Vendors ({vendors.length})</h3>
          {!role === "Admin" && message && <p style={styles.msg}>{message}</p>}
          {vendors.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No vendors found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Contact</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  {role === "Admin" && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td style={styles.td}>{v.name}</td>
                    <td style={styles.td}>{v.contactPerson}</td>
                    <td style={styles.td}>{v.phone}</td>
                    <td style={styles.td}>{v.email}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: v.isActive ? "#16a34a" : "#dc2626" }}>
                        {v.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {role === "Admin" && (
                      <td style={styles.td}>
                        <button style={{ ...styles.actionBtn, background: "#2563eb", marginRight: "6px" }} onClick={() => handleEdit(v)}>Edit</button>
                        <button style={{ ...styles.actionBtn, background: "#dc2626" }} onClick={() => handleDelete(v.id)}>Delete</button>
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
  cardTitle: { margin: "0 0 16px", color: "#111827" },
  form: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "420px" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" },
  btn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  msg: { color: "#dc2626", marginBottom: "12px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", borderBottom: "2px solid #e5e7eb", color: "#374151", fontSize: "13px" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: "14px" },
  badge: { color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "12px" },
  actionBtn: { color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
};

export default VendorManagement;
