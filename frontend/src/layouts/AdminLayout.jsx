import { Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login");
  };

  return (
    <div style={wrapper}>
      <aside style={sidebar}>
        <Link to="/" style={logo}>
          Shanam<span style={{ color: "#f7a6c1" }}>Nest</span>
        </Link>

        <p style={sectionTitle}>Admin Control</p>

        <nav style={nav}>
          <Link style={navLink} to="/admin/dashboard">
            Dashboard
          </Link>

          <Link style={navLink} to="/admin/grievances">
            Manage Grievances
          </Link>

          <Link style={navLink} to="/admin/members">
            Manage Members
          </Link>

          <Link style={navLink} to="/admin/contact-messages">
            Contact Messages
          </Link>

          <Link style={navLink} to="/admin/live-chats">
            Live Chats
          </Link>

          <Link style={navLink} to="/admin/reports">
            Reports
          </Link>

          <button type="button" onClick={handleLogout} style={logoutButton}>
            Logout
          </button>
        </nav>
      </aside>

      <main style={mainArea}>
        <header style={topbar}>
          <div>
            <h3 style={{ margin: 0, color: "#28141c" }}>Admin Dashboard</h3>
            <p style={{ margin: "4px 0 0", color: "#65535a" }}>
              Manage members, grievances, replies and support status
            </p>
          </div>

          <div style={badge}>Admin</div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}

const wrapper = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "290px 1fr",
  fontFamily: "Arial",
  background: "#fff7fa",
};

const sidebar = {
  padding: "28px",
  background: "#28141c",
  color: "#ffffff",
  boxShadow: "8px 0 35px rgba(40, 20, 28, 0.18)",
};

const logo = {
  display: "block",
  marginBottom: "38px",
  fontSize: "28px",
  fontWeight: "900",
  color: "#ffffff",
  textDecoration: "none",
};

const sectionTitle = {
  margin: "0 0 16px",
  color: "#f7c8d8",
  fontWeight: "900",
  fontSize: "13px",
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const nav = {
  display: "grid",
  gap: "14px",
};

const navLink = {
  padding: "14px 18px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "800",
  border: "1px solid rgba(255,255,255,0.12)",
};

const logoutButton = {
  ...navLink,
  marginTop: "20px",
  background: "#d4537e",
  border: "1px solid #d4537e",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "16px",
  fontFamily: "Arial",
};

const mainArea = {
  minWidth: 0,
};

const topbar = {
  minHeight: "76px",
  padding: "16px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "18px",
  background: "#ffffffcc",
  backdropFilter: "blur(14px)",
  borderBottom: "1px solid #f0ccd9",
};

const badge = {
  padding: "10px 18px",
  borderRadius: "999px",
  background: "#fbeaf0",
  color: "#993556",
  fontWeight: "900",
};