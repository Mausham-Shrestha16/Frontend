import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

const emptyForm = { customerId: "", invoiceDate: "", paidAmount: "" };
const emptyItem = { partName: "", quantity: 1, unitPrice: "" };

function SalesInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [emailStatus, setEmailStatus] = useState({});

  const fetchData = async () => {
    try {
      const [invRes, custRes] = await Promise.all([
        axiosClient.get("/sales-invoices"),
        axiosClient.get("/customers/search?keyword="),
      ]);
      setInvoices(invRes.data);
      setCustomers(custRes.data);
    } catch {
      setMessage("Failed to load data.");
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addItem = () => setItems([...items, { ...emptyItem }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const calcTotal = () => items.reduce((sum, it) => sum + (parseFloat(it.unitPrice) || 0) * (parseInt(it.quantity) || 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axiosClient.post("/sales-invoices", {
        customerId: parseInt(form.customerId),
        invoiceDate: form.invoiceDate,
        paidAmount: parseFloat(form.paidAmount) || 0,
        items: items.map(it => ({ partName: it.partName, quantity: parseInt(it.quantity), unitPrice: parseFloat(it.unitPrice) }))
      });
      setMessage("Sales invoice created.");
      setShowForm(false);
      setForm(emptyForm);
      setItems([{ ...emptyItem }]);
      fetchData();
    } catch (err) {
      setMessage(err.response?.data || "Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async (id) => {
    setEmailStatus(s => ({ ...s, [id]: "sending" }));
    try {
      await axiosClient.post(`/sales-invoices/${id}/send-email`);
      setEmailStatus(s => ({ ...s, [id]: "sent" }));
    } catch {
      setEmailStatus(s => ({ ...s, [id]: "failed" }));
    }
  };

  return (
    <DashboardLayout title="Sales Invoices">
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={styles.cardTitle}>Sales Invoices ({invoices.length})</h3>
            <button style={styles.btn} onClick={() => { setShowForm(!showForm); setMessage(""); }}>
              {showForm ? "Cancel" : "+ New Invoice"}
            </button>
          </div>

          {message && <p style={styles.msg}>{message}</p>}

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.formBox}>
              <h4 style={{ margin: "0 0 12px" }}>New Sales Invoice</h4>
              <select style={styles.input} value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} required>
                <option value="">Select Customer</option>
                {customers.map(c => <option key={c.customerId} value={c.customerId}>{c.fullName} — {c.phoneNumber}</option>)}
              </select>
              <input style={styles.input} type="date" value={form.invoiceDate} onChange={e => setForm({ ...form, invoiceDate: e.target.value })} required />

              <h5 style={{ margin: "10px 0 6px" }}>Items</h5>
              {items.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                  <input style={{ ...styles.input, flex: 2 }} placeholder="Part name" value={it.partName} onChange={e => updateItem(i, "partName", e.target.value)} required />
                  <input style={{ ...styles.input, width: "70px" }} type="number" min="1" placeholder="Qty" value={it.quantity} onChange={e => updateItem(i, "quantity", e.target.value)} required />
                  <input style={{ ...styles.input, width: "90px" }} type="number" step="0.01" placeholder="Price" value={it.unitPrice} onChange={e => updateItem(i, "unitPrice", e.target.value)} required />
                  {items.length > 1 && <button type="button" onClick={() => removeItem(i)} style={{ ...styles.actionBtn, background: "#dc2626" }}>✕</button>}
                </div>
              ))}
              <button type="button" onClick={addItem} style={{ ...styles.actionBtn, background: "#6b7280", marginBottom: "10px" }}>+ Add Item</button>

              <p style={{ margin: "4px 0 10px", fontWeight: "bold" }}>Total: ${calcTotal().toFixed(2)}</p>
              <input style={styles.input} type="number" step="0.01" placeholder="Paid Amount" value={form.paidAmount} onChange={e => setForm({ ...form, paidAmount: e.target.value })} />
              <button style={styles.btn} type="submit" disabled={loading}>{loading ? "Creating..." : "Create Invoice"}</button>
            </form>
          )}

          {invoices.length === 0 ? <p style={{ color: "#6b7280" }}>No invoices yet.</p> : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Invoice #</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Paid</th>
                  <th style={styles.th}>Balance</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => (
                  <React.Fragment key={inv.id}>
                    <tr>
                      <td style={styles.td}>{inv.invoiceNumber}</td>
                      <td style={styles.td}>{inv.customerName}</td>
                      <td style={styles.td}>{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                      <td style={styles.td}>${inv.totalAmount.toFixed(2)}</td>
                      <td style={styles.td}>${inv.paidAmount.toFixed(2)}</td>
                      <td style={styles.td}>
                        <span style={{ color: inv.creditAmount > 0 ? "#dc2626" : "#16a34a", fontWeight: "bold" }}>
                          ${inv.creditAmount.toFixed(2)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button style={{ ...styles.actionBtn, background: "#2563eb", marginRight: "6px" }}
                          onClick={() => setSelected(selected?.id === inv.id ? null : inv)}>
                          {selected?.id === inv.id ? "Hide" : "View"}
                        </button>
                        <button
                          style={{ ...styles.actionBtn, background: emailStatus[inv.id] === "sent" ? "#16a34a" : "#7c3aed" }}
                          onClick={() => sendEmail(inv.id)}
                          disabled={emailStatus[inv.id] === "sending"}>
                          {emailStatus[inv.id] === "sending" ? "..." : emailStatus[inv.id] === "sent" ? "Sent ✓" : "Email"}
                        </button>
                      </td>
                    </tr>
                    {selected?.id === inv.id && (
                      <tr>
                        <td colSpan="7" style={{ padding: "12px 16px", background: "#f9fafb" }}>
                          <table style={styles.table}>
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
                                  <td style={styles.td}>{it.partName}</td>
                                  <td style={styles.td}>{it.quantity}</td>
                                  <td style={styles.td}>${it.unitPrice.toFixed(2)}</td>
                                  <td style={styles.td}>${it.subTotal.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

export default SalesInvoices;
