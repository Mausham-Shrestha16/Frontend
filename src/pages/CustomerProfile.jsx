import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import axiosClient from "../api/axiosClient";

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: "",
    vehicleType: "",
    brand: "",
    model: "",
    year: "",
  });

  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setError("");
    setMessage("");

    try {
      const response = await axiosClient.get("/customers/me");
      setProfile(response.data);

      setProfileForm({
        fullName: response.data.fullName || "",
        phoneNumber: response.data.phoneNumber || "",
        address: response.data.address || "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile.");
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleVehicleChange = (e) => {
    setVehicleForm({
      ...vehicleForm,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axiosClient.put("/customers/me", profileForm);
      setProfile(response.data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const saveVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const payload = {
      ...vehicleForm,
      year: vehicleForm.year ? Number(vehicleForm.year) : null,
    };

    try {
      let response;

      if (editingVehicleId) {
        response = await axiosClient.put(
          `/customers/me/vehicles/${editingVehicleId}`,
          payload
        );
        setMessage("Vehicle updated successfully.");
      } else {
        response = await axiosClient.post("/customers/me/vehicles", payload);
        setMessage("Vehicle added successfully.");
      }

      setProfile(response.data);
      resetVehicleForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const editVehicle = (vehicle) => {
    setEditingVehicleId(vehicle.vehicleId);
    setVehicleForm({
      vehicleNumber: vehicle.vehicleNumber || "",
      vehicleType: vehicle.vehicleType || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year || "",
    });
  };

  const deleteVehicle = async (vehicleId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirmDelete) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axiosClient.delete(`/customers/me/vehicles/${vehicleId}`);
      setMessage("Vehicle deleted successfully.");
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete vehicle.");
    } finally {
      setLoading(false);
    }
  };

  const resetVehicleForm = () => {
    setEditingVehicleId(null);
    setVehicleForm({
      vehicleNumber: "",
      vehicleType: "",
      brand: "",
      model: "",
      year: "",
    });
  };

  if (error && !profile) {
    return (
      <DashboardLayout title="My Profile">
        <div style={styles.error}>{error}</div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout title="My Profile">
        <div style={styles.card}>
          <p style={styles.empty}>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Profile">
      {message && <div style={styles.success}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Profile Information</h2>

          <form onSubmit={updateProfile}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              name="fullName"
              value={profileForm.fullName}
              onChange={handleProfileChange}
              required
            />

            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              value={profile.email}
              disabled
            />

            <label style={styles.label}>Phone Number</label>
            <input
              style={styles.input}
              name="phoneNumber"
              value={profileForm.phoneNumber}
              onChange={handleProfileChange}
              required
            />

            <label style={styles.label}>Address</label>
            <input
              style={styles.input}
              name="address"
              value={profileForm.address}
              onChange={handleProfileChange}
            />

            <button style={styles.button} disabled={loading}>
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>
            {editingVehicleId ? "Update Vehicle" : "Add Vehicle"}
          </h2>

          <form onSubmit={saveVehicle}>
            <label style={styles.label}>Vehicle Number</label>
            <input
              style={styles.input}
              name="vehicleNumber"
              value={vehicleForm.vehicleNumber}
              onChange={handleVehicleChange}
              required
            />

            <label style={styles.label}>Vehicle Type</label>
            <input
              style={styles.input}
              name="vehicleType"
              value={vehicleForm.vehicleType}
              onChange={handleVehicleChange}
              required
            />

            <label style={styles.label}>Brand</label>
            <input
              style={styles.input}
              name="brand"
              value={vehicleForm.brand}
              onChange={handleVehicleChange}
              required
            />

            <label style={styles.label}>Model</label>
            <input
              style={styles.input}
              name="model"
              value={vehicleForm.model}
              onChange={handleVehicleChange}
              required
            />

            <label style={styles.label}>Year</label>
            <input
              style={styles.input}
              name="year"
              type="number"
              value={vehicleForm.year}
              onChange={handleVehicleChange}
            />

            <div style={styles.buttonRow}>
              <button style={styles.button} disabled={loading}>
                {editingVehicleId ? "Update Vehicle" : "Add Vehicle"}
              </button>

              {editingVehicleId && (
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={resetVehicleForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>My Vehicles</h2>

        {!profile.vehicles || profile.vehicles.length === 0 ? (
          <p style={styles.empty}>No vehicles added yet.</p>
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
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {profile.vehicles.map((vehicle) => (
                  <tr key={vehicle.vehicleId}>
                    <td style={styles.td}>{vehicle.vehicleNumber}</td>
                    <td style={styles.td}>{vehicle.vehicleType}</td>
                    <td style={styles.td}>{vehicle.brand}</td>
                    <td style={styles.td}>{vehicle.model}</td>
                    <td style={styles.td}>{vehicle.year || "N/A"}</td>
                    <td style={styles.td}>
                      <button
                        style={styles.smallButton}
                        onClick={() => editVehicle(vehicle)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.dangerButton}
                        onClick={() => deleteVehicle(vehicle.vehicleId)}
                      >
                        Delete
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
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
  label: {
    display: "block",
    marginBottom: "6px",
    marginTop: "12px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
  },
  buttonRow: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
  },
  button: {
    marginTop: "18px",
    padding: "11px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryButton: {
    marginTop: "18px",
    padding: "11px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#6b7280",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  smallButton: {
    padding: "7px 10px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    marginRight: "8px",
    cursor: "pointer",
  },
  dangerButton: {
    padding: "7px 10px",
    border: "none",
    borderRadius: "6px",
    background: "#dc2626",
    color: "white",
    cursor: "pointer",
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
  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  empty: {
    color: "#6b7280",
  },
};

export default CustomerProfile;