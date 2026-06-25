import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";

export default function MemberLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
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
            Shanam<span style={{ color: "#d4537e" }}>Nest</span>
          </span>
        </Link>

        <div style={portalBox}>
          <p style={portalSmall}>Member Portal</p>
          <h3 style={portalTitle}>Family Support</h3>
        </div>

        <nav style={nav}>
          <p style={navSection}>Main</p>

          <NavLink style={getNavLinkStyle} to="/member/dashboard">
            🏠 Dashboard
          </NavLink>

          <NavLink style={getNavLinkStyle} to="/member/submit-grievance">
            📝 Submit Grievance
          </NavLink>

          <NavLink style={getNavLinkStyle} to="/member/my-grievances">
            📋 My Grievances
          </NavLink>

          <NavLink style={getNavLinkStyle} to="/member/profile">
            👤 My Profile
          </NavLink>

          <p style={navSection}>Support</p>

          <NavLink style={getNavLinkStyle} to="/contact">
            📞 Contact Support
          </NavLink>

          <NavLink style={getNavLinkStyle} to="/live-chat">
            💬 Live Chat
          </NavLink>

          <button type="button" onClick={handleLogout} style={logoutButton}>
            🚪 Logout
          </button>
        </nav>
      </aside>

      <main style={mainArea}>
        <header style={topbar}>
          <div>
            <h3 style={{ margin: 0, color: "#28141c" }}>Member Portal</h3>
            <p style={{ margin: "4px 0 0", color: "#65535a" }}>
              Welcome back to your ShanamNest dashboard
            </p>
          </div>

          <div style={badge}>Member</div>
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
  padding: "26px",
  background: "#ffffff",
  borderRight: "1px solid #f0ccd9",
  boxShadow: "8px 0 35px rgba(153, 53, 86, 0.08)",
};

const logo = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "26px",
  fontSize: "26px",
  fontWeight: "900",
  color: "#993556",
  textDecoration: "none",
};

const logoImg = {
  width: "52px",
  height: "52px",
  objectFit: "contain",
  borderRadius: "50%",
  background: "#fbeaf0",
  padding: "4px",
  border: "1px solid #f0ccd9",
};

const portalBox = {
  padding: "18px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #993556, #d4537e)",
  color: "#ffffff",
  marginBottom: "26px",
  boxShadow: "0 16px 36px rgba(212, 83, 126, 0.24)",
};

const portalSmall = {
  margin: "0 0 8px",
  color: "#ffe6ef",
  fontWeight: "800",
  fontSize: "13px",
};

const portalTitle = {
  margin: 0,
  fontSize: "21px",
  lineHeight: "1.25",
};

const nav = {
  display: "grid",
  gap: "12px",
};

const navSection = {
  margin: "12px 0 2px",
  color: "#993556",
  fontSize: "12px",
  fontWeight: "900",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const navLink = {
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#fff7fa",
  color: "#4d2c38",
  textDecoration: "none",
  fontWeight: "800",
  border: "1px solid #f0ccd9",
  transition: "0.2s ease",
};

const activeNavLink = {
  background: "#d4537e",
  color: "#ffffff",
  border: "1px solid #d4537e",
  boxShadow: "0 12px 26px rgba(212, 83, 126, 0.26)",
};

const logoutButton = {
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#28141c",
  color: "#ffffff",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "16px",
  fontFamily: "Arial",
  fontWeight: "900",
  border: "none",
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