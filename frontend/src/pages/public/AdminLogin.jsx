import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";
import "./Login.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter admin username/email and password.");
      return;
    }

    try {
      setLoading(true);

      const data = await authAPI.login({
        username: formData.username.trim(),
        password: formData.password,
      });

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      const currentUser = await authAPI.currentUser();

      if (!currentUser.is_staff && !currentUser.is_superuser) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setError("Member account cannot login from Admin Login.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (err) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setError("Invalid admin credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-left">
        <p className="login-tag">Admin Secure Access</p>

        <h1>
          Admin Control for <span>ShanamNest</span>
        </h1>

        <p className="login-text">
          Login here only if you are an authorized admin or staff member.
          Members should use the Member Login page.
        </p>

        <div className="login-points">
          <div>
            <strong>✓ Manage Grievances</strong>
            <p>Review, update, and reply to member grievances.</p>
          </div>

          <div>
            <strong>✓ Manage Members</strong>
            <p>View registered members and support records.</p>
          </div>

          <div>
            <strong>✓ Admin Reports</strong>
            <p>Track contact messages, live chats, and grievance status.</p>
          </div>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Admin Login</h2>
            <p>Only authorized admin accounts can continue</p>
          </div>

          {error && (
            <div
              style={{
                padding: "16px 18px",
                marginBottom: "20px",
                borderRadius: "18px",
                background: "#fff0f3",
                border: "1px solid #f3b6c5",
                color: "#993556",
                fontWeight: "800",
                lineHeight: "1.6",
              }}
            >
              {error}
            </div>
          )}

          <form className="login-form">
            <label>Admin Username / Email</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username or email"
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <button type="button" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Admin Login"}
            </button>
          </form>

          <p className="register-link">
            Member? <Link to="/login">Go to Member Login</Link>
          </p>

          <p className="register-link">
            Back to <Link to="/">Home</Link>
          </p>
        </div>
      </section>
    </main>
  );
}