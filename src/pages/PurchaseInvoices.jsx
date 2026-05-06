import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function PurchaseInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [parts, setParts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vendorId: "", purchaseDate: "", notes: "" });
  const [items, setItems] = useState([{ partId: "", quantity: 1, unitPrice: "" }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchData = async () => {
    try {
      const [invRes, vendorRes, partRes] = await Promise.all([
        axiosClient.get("/purchase-invoices"),
        axiosClient.get("/vendors"),
        axiosClient.get("/parts"),
      ]);
      setInvoices(invRes.data);
      setVendors(vendorRes.data);
      setParts(partRes.data);
    } catch {
      setMessage("Failed to load data.");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = () => setItems([...items, { partId: "", quantity: 1, unitPrice: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const handlePartSelect = (i, partId) => {
    const part = parts.find(p => p.id === parseInt(partId));
    const updated = [...items];
    updated[i].partId = partId;
    updated[i].unitPrice = part ? part.unitPrice : "";
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const payload = {
        vendorId: parseInt(form.vendorId),
        purchaseDate: form.purchaseDate,
        notes: form.notes,
        items: items.map(it => ({ partId: parseInt(it.partId), quantity: parseInt(it.quantity), unitPrice: parseFloat(it.unitPrice) }))
      };
      await axiosClient.post("/purchase-invoices", payload);
      setMessage("Purchase invoice created. Stock updated.");
      setShowForm(false);
      setForm({ vendorId: "", purchaseDate: "", notes: "" });
      setItems([{ partId: "", quantity: 1, unitPrice: "" }]);
      fetchData();
    } catch (err) {
      setMessage(err.response?.data || "Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Purchase Invoices">
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={styles.cardTitle}>Purchase Invoices ({invoices.length})</h3>
            <button style={styles.btn} onClick={() => { setShowForm(!showForm); setMessage(""); }}>
              {showForm ? "Cancel" : "+ New Invoice"}
            </button>
          </div>

          {message && <p style={styles.msg}>{message}</p>}

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.formBox}>
              <h4 style={{ margin: "0 0 12px" }}>New Purchase Invoice</h4>
              <select style={styles.input} value={form.vendorId} onChange={e => setForm({ ...form, vendorId: e.target.value })} required>
                <option value="">Select Vendor</option>
                {vendors.filter(v => v.isActive).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
              <input style={styles.input} type="date" value={form.purchaseDate} onChange={e => setForm({ ...form, purchaseDate: e.target.value })} required />
              <input style={styles.input} placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />

              <h5 style={{ margin: "12px 0 8px" }}>Items</h5>
              {items.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <select style={{ ...styles.input, flex: 2 }} value={it.partId} onChange={e => handlePartSelect(i, e.target.value)} required>
                    <option value="">Select Part</option>
                    {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.partNumber})</option>)}
                  </select>
                  <input style={{ ...styles.input, width: "70px" }} type="number" min="1" placeholder="Qty" value={it.quantity} onChange={e => updateItem(i, "quantity", e.target.value)} required />
                  <input style={{ ...styles.input, width: "90px" }} type="number" step="0.01" placeholder="Price" value={it.unitPrice} onChange={e => updateItem(i, "unitPrice", e.target.value)} required />
                  {items.length > 1 && <button type="button" onClick={() => removeItem(i)} style={{ ...styles.actionBtn, background: "#dc2626" }}>✕</button>}
                </div>
              ))}
              <button type="button" onClick={addItem} style={{ ...styles.actionBtn, background: "#6b7280", marginBottom: "12px" }}>+ Add Item</button>
              <div>
                <button style={styles.btn} type="submit" disabled={loading}>{loading ? "Creating..." : "Create Invoice"}</button>
              </div>
            </form>
          )}

          {invoices.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No purchase invoices yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Invoice #</th>
                  <th style={styles.th}>Vendor</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Details</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <>
                    <tr key={inv.id}>
                      <td style={styles.td}>{inv.invoiceNumber}</td>
                      <td style={styles.td}>{inv.vendorName}</td>
                      <td style={styles.td}>{new Date(inv.purchaseDate).toLocaleDateString()}</td>
                      <td style={styles.td}>${inv.totalAmount.toFixed(2)}</td>
                      <td style={styles.td}>{inv.items.length}</td>
                      <td style={styles.td}>
                        <button style={{ ...styles.actionBtn, background: "#2563eb" }}
                          onClick={() => setSelectedInvoice(selectedInvoice?.id === inv.id ? null : inv)}>
                          {selectedInvoice?.id === inv.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {selectedInvoice?.id === inv.id && (
                      <tr key={`${inv.id}-detail`}>
                        <td colSpan="6" style={{ padding: "12px 16px", background: "#f9fafb" }}>
                          <strong>Items:</strong>
                          <table style={{ ...styles.table, marginTop: "8px" }}>
                            <thead>
                              <tr>
                                <th style={styles.th}>Part</th>
                                <th style={styles.th}>Qty</th>
                                <th style={styles.th}>Unit Price</th>
                                <th style={styles.th}>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {inv.items.map(it => (
                                <tr key={it.id}>
                                  <td style={styles.td}>{it.partName} ({it.partNumber})</td>
                                  <td style={styles.td}>{it.quantity}</td>
                                  <td style={styles.td}>${it.unitPrice.toFixed(2)}</td>
                                  <td style={styles.td}>${it.subTotal.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {inv.notes && <p style={{ marginTop: "8px", color: "#6b7280" }}>Notes: {inv.notes}</p>}
                        </td>
                      </tr>
                    )}
                  </>
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
  actionBtn: { color: "white", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
};

export default PurchaseInvoices;
