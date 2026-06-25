import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";
import "./Login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    const { name, value } = e.target;

    if (name === "otp") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 6);

      setFormData({
        ...formData,
        otp: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRequestOTP = async () => {
    setError("");
    setSuccess("");

    if (!formData.email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);

      await authAPI.requestPasswordResetOTP({
        email: formData.email.trim(),
      });

      setStep(2);
      setSuccess(
        "Password reset OTP sent successfully. Check backend terminal for OTP in development mode."
      );
    } catch (err) {
      setError(err.message || "Unable to send password reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (!formData.otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (formData.otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    if (!formData.new_password.trim()) {
      setError("Please enter new password.");
      return;
    }

    if (formData.new_password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);

      await authAPI.verifyPasswordResetOTP({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });

      setSuccess("Password reset successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-left">
        <p className="login-tag">Account Recovery</p>

        <h1>
          Reset your <span>ShanamNest</span> password
        </h1>

        <p className="login-text">
          Enter your registered email address, verify OTP, and create a new
          password for your member portal.
        </p>

        <div className="login-points">
          <div>
            <strong>✓ Secure OTP Verification</strong>
            <p>Only registered members can request password reset OTP.</p>
          </div>

          <div>
            <strong>✓ Quick Password Reset</strong>
            <p>OTP is valid for 10 minutes in development mode.</p>
          </div>

          <div>
            <strong>✓ Login Again</strong>
            <p>After reset, use your new password to login.</p>
          </div>
        </div>
      </section>

      <section className="login-right">
        <div className="login-card">
          <div className="login-card-header">
            <h2>Forgot Password</h2>
            <p>
              {step === 1
                ? "Enter your registered email"
                : "Enter OTP and new password"}
            </p>
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

          {success && (
            <div
              style={{
                padding: "16px 18px",
                marginBottom: "20px",
                borderRadius: "18px",
                background: "#e8fff2",
                border: "1px solid #b6edca",
                color: "#1d7a46",
                fontWeight: "800",
                lineHeight: "1.6",
              }}
            >
              ✓ {success}
            </div>
          )}

          <form className="login-form">
            <label>Registered Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter registered email"
              disabled={step === 2 || loading}
            />

            {step === 1 && (
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            )}

            {step === 2 && (
              <>
                <label>OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6 digit OTP"
                  inputMode="numeric"
                  maxLength="6"
                  disabled={loading}
                />

                <label>New Password</label>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  disabled={loading}
                />

                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={handleRequestOTP}
                  disabled={loading}
                  style={{
                    marginTop: "12px",
                    background: "#fff7fa",
                    color: "#993556",
                    border: "1px solid #f0ccd9",
                  }}
                >
                  Resend OTP
                </button>
              </>
            )}
          </form>

          <p className="register-link">
            Remember password? <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}