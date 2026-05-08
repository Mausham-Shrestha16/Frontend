import { Link, useNavigate } from "react-router-dom";

function DashboardLayout({ title, children }) {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>Vehicle Parts</h2>
        <p style={styles.roleBadge}>{role || "User"}</p>

      <nav style={styles.nav}>
        {role === "Admin" && (
          <Link style={styles.link} to="/admin-dashboard">
            Dashboard
          </Link>
        )}

        {role === "Staff" && (
          <Link style={styles.link} to="/staff-dashboard">
            Dashboard
          </Link>
        )}

        {role === "Customer" && (
          <Link style={styles.link} to="/customer-dashboard">
            Dashboard
          </Link>
        )}

        {(role === "Admin" || role === "Staff") && (
          <>
            <Link style={styles.link} to="/customer-search">
              Customer Search
            </Link>

            <Link style={styles.link} to="/customer-report">
              Customer Report
            </Link>
          </>
        )}
      </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.subtitle}>Welcome, {fullName || "User"}</p>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </header>

        {children}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    background: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
  },
  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#ffffff",
    padding: "24px",
    boxSizing: "border-box",
  },
  logo: {
    margin: "0 0 8px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  roleBadge: {
    display: "inline-block",
    background: "#2563eb",
    color: "#ffffff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    marginBottom: "28px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    padding: "12px",
    borderRadius: "8px",
    background: "#1f2937",
  },
  main: {
    flex: 1,
    padding: "28px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "26px",
  },
  title: {
    margin: 0,
    color: "#111827",
  },
  subtitle: {
    marginTop: "6px",
    color: "#6b7280",
  },
  logoutButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default DashboardLayout;