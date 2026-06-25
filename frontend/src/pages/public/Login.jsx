import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";
import "./Login.css";

export default function Login() {
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
      setError("Please enter email and password.");
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

      if (currentUser.is_staff || currentUser.is_superuser) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setError("Admin account cannot login from Member Login. Please use Admin Login.");
        return;
      }

      navigate("/member/dashboard");
    } catch  {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-left">
        <p className="login-tag">Secure Member Access</p>

        <h1>
          Welcome back to <span>ShanamNest</span>
        </h1>

        <p className="login-text">
          Login to access your member dashboard, update your profile, submit
          grievances, and track support replies from the ShanamNest team.
        </p>

        <div className="login-points">
          <div>
            <strong>✓ Member Dashboard</strong>
            <p>View your profile and service updates.</p>
          </div>

          <div>
            <strong>✓ Grievance Tracking</strong>
            <p>Track status from Pending to Resolved.</p>
          </div>

          <div>
            <strong>✓ Secure Communication</strong>
            <p>Receive official replies from support staff.</p>
          </div>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Member Login</h2>
            <p>Only registered members can continue here</p>
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
            <label>Email Address</label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter email address"
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <div className="form-row">
              <label className="remember">
                <input type="checkbox" />
                Remember me
              </label>

              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="button" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Member Login"}
            </button>
          </form>

          <p className="register-link">
            New member? <Link to="/register">Create an account</Link>
          </p>

          <p className="register-link">
            Admin? <Link to="/admin-login">Login as Admin</Link>
          </p>
        </div>
      </section>
    </main>
  );
}