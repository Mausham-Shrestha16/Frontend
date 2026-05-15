import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "4px", fontSize: "28px", cursor: onChange ? "pointer" : "default" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          style={{ color: n <= value ? "#f59e0b" : "#d1d5db" }}
          onClick={() => onChange && onChange(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function Reviews() {
  const role = localStorage.getItem("role");
  const isCustomer = role === "Customer";

  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const endpoint = isCustomer ? "/reviews/my" : "/reviews";
      const res = await axiosClient.get(endpoint);
      setReviews(res.data);
    } catch {
      setMessage("Failed to load reviews.");
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await axiosClient.post("/reviews", {
        rating: form.rating,
        comment: form.comment,
      });
      setMessage("Review submitted. Thank you!");
      setShowForm(false);
      setForm({ rating: 5, comment: "" });
      fetchReviews();
    } catch (err) {
      setMessage(err.response?.data || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <DashboardLayout title="Reviews">
      <div style={styles.container}>
        {!isCustomer && avgRating && (
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Average Rating</p>
            <p style={styles.statValue}>{avgRating} / 5</p>
            <StarRating value={Math.round(avgRating)} />
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "6px" }}>{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        )}

        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={styles.cardTitle}>
              {isCustomer ? "My Reviews" : "All Reviews"} ({reviews.length})
            </h3>
            {isCustomer && (
              <button style={styles.btn} onClick={() => { setShowForm(!showForm); setMessage(""); }}>
                {showForm ? "Cancel" : "+ Write a Review"}
              </button>
            )}
          </div>

          {message && <p style={message.includes("Thank") ? styles.success : styles.msg}>{message}</p>}

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.formBox}>
              <h4 style={{ margin: "0 0 12px" }}>Submit Your Review</h4>
              <label style={styles.label}>Rating</label>
              <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
              <label style={{ ...styles.label, marginTop: "8px" }}>Comment</label>
              <textarea
                style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
                placeholder="Share your experience..."
                value={form.comment}
                onChange={e => setForm({ ...form, comment: e.target.value })}
                required
              />
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No reviews yet.</p>
          ) : (
            <div style={styles.reviewList}>
              {reviews.map(r => (
                <div key={r.id} style={styles.reviewCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      {!isCustomer && <p style={styles.reviewerName}>{r.customerName}</p>}
                      <StarRating value={r.rating} />
                    </div>
                    <span style={styles.date}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={styles.comment}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "24px" },
  statCard: { background: "white", padding: "20px 24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  statLabel: { margin: 0, color: "#6b7280", fontSize: "14px" },
  statValue: { margin: "4px 0 8px", fontSize: "32px", fontWeight: "bold", color: "#111827" },
  card: { background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
  cardTitle: { margin: 0, color: "#111827" },
  formBox: { background: "#f9fafb", padding: "16px", borderRadius: "8px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "13px", color: "#374151", fontWeight: "600" },
  input: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px" },
  btn: { padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  msg: { color: "#dc2626", marginBottom: "12px" },
  success: { color: "#16a34a", marginBottom: "12px" },
  reviewList: { display: "flex", flexDirection: "column", gap: "12px" },
  reviewCard: { border: "1px solid #e5e7eb", borderRadius: "10px", padding: "14px 16px" },
  reviewerName: { margin: "0 0 4px", fontWeight: "600", color: "#111827" },
  date: { fontSize: "12px", color: "#9ca3af" },
  comment: { margin: "10px 0 0", color: "#374151", lineHeight: "1.5" },
};

export default Reviews;
