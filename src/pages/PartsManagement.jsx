import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

const emptyForm = { partNumber: "", name: "", description: "", category: "", unitPrice: "", stockQuantity: "", reorderLevel: "" };

function PartsManagement() {
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const role = localStorage.getItem("role");

  const fetchParts = async () => {
    try {
      const res = await axiosClient.get("/parts");
      setParts(res.data);
    } catch {
      setMessage("Failed to load parts.");
    }
  };

  useEffect(() => { fetchParts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const payload = { ...form, unitPrice: parseFloat(form.unitPrice), stockQuantity: parseInt(form.stockQuantity), reorderLevel: parseInt(form.reorderLevel) };
    try {
      if (editId) {
        await axiosClient.put(`/parts/${editId}`, payload);
        setMessage("Part updated successfully.");
      } else {
        await axiosClient.post("/parts", payload);
        setMessage("Part added successfully.");
      }
      setForm(emptyForm);
      setEditId(null);
      fetchParts();
    } catch (err) {
      setMessage(err.response?.data || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (part) => {
    setEditId(part.id);
    setForm({ partNumber: part.partNumber, name: part.name, description: part.description, category: part.category, unitPrice: part.unitPrice, stockQuantity: part.stockQuantity, reorderLevel: part.reorderLevel });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this part?")) return;
    try {
      await axiosClient.delete(`/parts/${id}`);
      setMessage("Part deleted.");
      fetchParts();
    } catch {
      setMessage("Delete failed.");
    }
  };

  const handleCancel = () => { setEditId(null); setForm(emptyForm); setMessage(""); };

  return (
    <DashboardLayout title="Parts Management">
      <div style={styles.container}>
        {role === "Admin" && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>{editId ? "Edit Part" : "Add New Part"}</h3>
            {message && <p style={styles.msg}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
              {!editId && <input style={styles.input} placeholder="Part Number" value={form.partNumber} onChange={e => setForm({ ...form, partNumber: e.target.value })} required />}
              <input style={styles.input} placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input style={styles.input} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <input style={styles.input} placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
              <input style={styles.input} type="number" step="0.01" placeholder="Unit Price" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} required />
              <input style={styles.input} type="number" placeholder="Stock Quantity" value={form.stockQuantity} onChange={e => setForm({ ...form, stockQuantity: e.target.value })} required />
              <input style={styles.input} type="number" placeholder="Reorder Level" value={form.reorderLevel} onChange={e => setForm({ ...form, reorderLevel: e.target.value })} required />
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={styles.btn} type="submit" disabled={loading}>{loading ? "Saving..." : editId ? "Update Part" : "Add Part"}</button>
                {editId && <button style={{ ...styles.btn, background: "#6b7280" }} type="button" onClick={handleCancel}>Cancel</button>}
              </div>
            </form>
          </div>
        )}

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Parts Inventory ({parts.length})</h3>
          {parts.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No parts found.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Part #</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Status</th>
                  {role === "Admin" && <th style={styles.th}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {parts.map(p => (
                  <tr key={p.id}>
                    <td style={styles.td}>{p.partNumber}</td>
                    <td style={styles.td}>{p.name}</td>
                    <td style={styles.td}>{p.category}</td>
                    <td style={styles.td}>${p.unitPrice.toFixed(2)}</td>
                    <td style={styles.td}>{p.stockQuantity}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: p.isLowStock ? "#dc2626" : "#16a34a" }}>
                        {p.isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    {role === "Admin" && (
                      <td style={styles.td}>
                        <button style={{ ...styles.actionBtn, background: "#2563eb", marginRight: "6px" }} onClick={() => handleEdit(p)}>Edit</button>
                        <button style={{ ...styles.actionBtn, background: "#dc2626" }} onClick={() => handleDelete(p.id)}>Delete</button>
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

export default PartsManagement;
