import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/");
  };

  const getNavLinkStyle = ({ isActive }) => ({
    ...navLink,
    ...(isActive ? activeNavLink : {}),
  });

  return (
    <div style={wrapper}>
      <aside style={sidebar}>
        <Link to="/" style={logo}>
          <img src="/logo.png" alt="ShanamNest Logo" style={logoImg} />
          <span>
            Shanam<span style={{ color: "#f7a6c1" }}>Nest</span>
          </span>
        </Link>

        <div style={adminBox}>
          <p style={adminSmall}>Admin Control</p>
          <h3 style={adminTitle}>Management Panel</h3>
        </div>

        <nav style={nav}>
          <p style={sectionTitle}>Overview</p>

          <NavLink style={getNavLinkStyle} to="/admin/dashboard">
            📊 Dashboard
          </NavLink>

          <p style={sectionTitle}>Management</p>

          <NavLink style={getNavLinkStyle} to="/admin/grievances">
            📝 Manage Grievances
          </NavLink>

          <NavLink style={getNavLinkStyle} to="/admin/members">
            👥 Manage Members
          </NavLink>

          <NavLink style={getNavLinkStyle} to="/admin/contact-messages">
            📩 Contact Messages
          </NavLink>

          <NavLink style={getNavLinkStyle} to="/admin/live-chats">
            💬 Live Chats
          </NavLink>

          <p style={sectionTitle}>Reports</p>

          <NavLink style={getNavLinkStyle} to="/admin/reports">
            📈 Reports
          </NavLink>

          <button type="button" onClick={handleLogout} style={logoutButton}>
            🚪 Logout
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
  gridTemplateColumns: "300px 1fr",
  fontFamily: "Arial",
  background: "#fff7fa",
};

const sidebar = {
  padding: "26px",
  background: "linear-gradient(180deg, #28141c 0%, #3d1c2a 100%)",
  color: "#ffffff",
  boxShadow: "8px 0 35px rgba(40, 20, 28, 0.18)",
};

const logo = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "26px",
  fontSize: "26px",
  fontWeight: "900",
  color: "#ffffff",
  textDecoration: "none",
};

const logoImg = {
  width: "52px",
  height: "52px",
  objectFit: "contain",
  borderRadius: "50%",
  background: "#fbeaf0",
  padding: "4px",
  border: "1px solid rgba(255,255,255,0.25)",
};

const adminBox = {
  padding: "18px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #993556, #d4537e)",
  color: "#ffffff",
  marginBottom: "26px",
  boxShadow: "0 16px 36px rgba(212, 83, 126, 0.22)",
};

const adminSmall = {
  margin: "0 0 8px",
  color: "#ffe6ef",
  fontWeight: "800",
  fontSize: "13px",
};

const adminTitle = {
  margin: 0,
  fontSize: "21px",
  lineHeight: "1.25",
};

const sectionTitle = {
  margin: "12px 0 2px",
  color: "#f7c8d8",
  fontWeight: "900",
  fontSize: "12px",
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const nav = {
  display: "grid",
  gap: "12px",
};

const navLink = {
  padding: "14px 16px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "800",
  border: "1px solid rgba(255,255,255,0.12)",
  transition: "0.2s ease",
};

const activeNavLink = {
  background: "#ffffff",
  color: "#993556",
  border: "1px solid #ffffff",
  boxShadow: "0 14px 28px rgba(0, 0, 0, 0.18)",
};

const logoutButton = {
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#d4537e",
  color: "#ffffff",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "16px",
  fontFamily: "Arial",
  fontWeight: "900",
  border: "1px solid #d4537e",
  marginTop: "18px",
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