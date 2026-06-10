import { Link, Outlet, useNavigate } from "react-router-dom";

export default function MemberLayout() {
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
          Shanam<span style={{ color: "#d4537e" }}>Nest</span>
        </Link>

        <nav style={nav}>
          <Link style={navLink} to="/member/dashboard">
            Dashboard
          </Link>

          <Link style={navLink} to="/member/submit-grievance">
            Submit Grievance
          </Link>

          <Link style={navLink} to="/member/my-grievances">
            My Grievances
          </Link>

          <Link style={navLink} to="/member/profile">
            My Profile
          </Link>

          <button type="button" onClick={handleLogout} style={logoutButton}>
            Logout
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
  gridTemplateColumns: "280px 1fr",
  fontFamily: "Arial",
  background: "#fff7fa",
};

const sidebar = {
  padding: "28px",
  background: "#ffffff",
  borderRight: "1px solid #f0ccd9",
  boxShadow: "8px 0 35px rgba(153, 53, 86, 0.08)",
};

const logo = {
  display: "block",
  marginBottom: "36px",
  fontSize: "28px",
  fontWeight: "900",
  color: "#993556",
  textDecoration: "none",
};

const nav = {
  display: "grid",
  gap: "14px",
};

const navLink = {
  padding: "14px 18px",
  borderRadius: "16px",
  background: "#fff7fa",
  color: "#4d2c38",
  textDecoration: "none",
  fontWeight: "800",
  border: "1px solid #f0ccd9",
};

const logoutButton = {
  ...navLink,
  marginTop: "20px",
  background: "#d4537e",
  color: "#ffffff",
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