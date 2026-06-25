import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/public/HomePage";
import Login from "../pages/public/Login";
import AdminLogin from "../pages/public/AdminLogin";
import ForgotPassword from "../pages/public/ForgotPassword";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import LiveChat from "../pages/public/LiveChat";
import NotFound from "../pages/public/NotFound";
import { authAPI } from "../api/api";

const theme = {
  primary: "#d4537e",
  secondary: "#fbeaf0",
  accent: "#993556",
  dark: "#28141c",
  text: "#65535a",
  border: "#f0ccd9",
  soft: "#fff7fa",
};

const inputStyle = {
  width: "100%",
  height: "54px",
  marginBottom: "18px",
  padding: "0 16px",
  borderRadius: "16px",
  border: "1px solid #e7bfd0",
  outline: "none",
  fontSize: "15px",
  background: "#fff9fb",
  color: "#28141c",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#4d2c38",
  fontWeight: "900",
  fontSize: "14px",
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    city: "",
    service_type: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    const { name, value } = e.target;

    if (name === "mobile_number") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

      setFormData({
        ...formData,
        mobile_number: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (
      !formData.full_name.trim() ||
      !formData.mobile_number.trim() ||
      !formData.email.trim() ||
      !formData.service_type ||
      !formData.password ||
      !formData.confirm_password
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      setError("Please enter a valid 10 digit Indian mobile number.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Password and confirm password do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await authAPI.register(formData);

      setSuccess("Account created successfully. Redirecting to login...");

      setFormData({
        full_name: "",
        mobile_number: "",
        email: "",
        city: "",
        service_type: "",
        password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
        fontFamily: "Arial",
        background:
          "radial-gradient(circle at top left, #fbeaf0 0, transparent 34%), linear-gradient(135deg, #fff7fa 0%, #ffffff 52%, #fbeaf0 100%)",
        display: "grid",
        gridTemplateColumns: "0.9fr 1.1fr",
      }}
    >
      <section
        style={{
          padding: "90px 8%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            width: "fit-content",
            padding: "10px 18px",
            borderRadius: "999px",
            background: theme.secondary,
            color: theme.accent,
            fontWeight: "900",
            marginBottom: "20px",
          }}
        >
          Join ANAM FOUNDATION
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(42px, 5.5vw, 70px)",
            lineHeight: "1.05",
            letterSpacing: "-2px",
            color: theme.dark,
          }}
        >
          Create your{" "}
          <span style={{ color: theme.primary }}>member account</span>
        </h1>

        <p
          style={{
            margin: "24px 0 34px",
            color: theme.text,
            lineHeight: "1.8",
            fontSize: "18px",
            maxWidth: "620px",
          }}
        >
          Register to access your dashboard, raise grievances, track support
          status, and stay connected with ANAM FOUNDATION services.
        </p>

        <div
          style={{
            padding: "26px",
            borderRadius: "28px",
            background: "rgba(255,255,255,0.76)",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 18px 50px rgba(153, 53, 86, 0.12)",
            maxWidth: "560px",
          }}
        >
          <h3 style={{ margin: "0 0 14px", color: theme.accent }}>
            Your member benefits
          </h3>

          {[
            "Secure member dashboard",
            "Grievance submission and tracking",
            "Official replies from support staff",
            "Family-friendly newborn care updates",
          ].map((item) => (
            <p
              key={item}
              style={{
                margin: "12px 0",
                color: theme.text,
                fontWeight: "700",
              }}
            >
              ✓ {item}
            </p>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: "70px 8%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "690px",
            padding: "38px",
            borderRadius: "34px",
            background: "#ffffff",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 28px 80px rgba(153, 53, 86, 0.18)",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "34px",
                color: theme.dark,
              }}
            >
              Member Registration
            </h2>

            <p style={{ margin: 0, color: theme.text }}>
              Fill your details to create a secure account.
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

          <form>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input
                  style={inputStyle}
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="Enter 10 digit mobile number"
                  inputMode="numeric"
                  maxLength="10"
                />
              </div>
            </div>

            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <div>
                <label style={labelStyle}>City / Area</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city or area"
                />
              </div>

              <div>
                <label style={labelStyle}>Service Type</label>
                <select
                  style={inputStyle}
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                >
                  <option value="">Select service type</option>
                  <option value="newborn_care">Newborn Care Support</option>
                  <option value="member_portal">Family Member Portal</option>
                  <option value="grievance_assistance">
                    Grievance Assistance
                  </option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                />
              </div>

              <div>
                <label style={labelStyle}>Confirm Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: "100%",
                height: "56px",
                border: "none",
                borderRadius: "999px",
                background: theme.primary,
                color: "white",
                fontSize: "16px",
                fontWeight: "900",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
                boxShadow: "0 14px 34px rgba(212, 83, 126, 0.32)",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: theme.text,
            }}
          >
            Already registered?{" "}
            <Link
              style={{
                color: theme.primary,
                fontWeight: "900",
                textDecoration: "none",
              }}
              to="/login"
            >
              Login here
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Services() {
  const services = [
    {
      title: "Newborn Care Support",
      text: "Gentle, reliable care support for families during the early newborn journey.",
    },
    {
      title: "Member Portal",
      text: "A secure dashboard where families can manage profiles and access updates.",
    },
    {
      title: "Grievance System",
      text: "Submit concerns, track status, and receive official support replies.",
    },
    {
      title: "Admin Replies",
      text: "Thread-based communication between members and support staff.",
    },
    {
      title: "Offline Chat Support",
      text: "Visitors can submit issues even outside live support hours.",
    },
    {
      title: "Service Guidance",
      text: "Clear service information designed for family-friendly access.",
    },
  ];

  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
        fontFamily: "Arial",
        background:
          "radial-gradient(circle at top right, #fbeaf0 0, transparent 30%), linear-gradient(135deg, #fff7fa 0%, #ffffff 55%, #fbeaf0 100%)",
      }}
    >
      <section style={{ padding: "95px 8% 50px", textAlign: "center" }}>
        <p
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: "999px",
            background: theme.secondary,
            color: theme.accent,
            fontWeight: "900",
          }}
        >
          Our Services
        </p>

        <h1
          style={{
            maxWidth: "920px",
            margin: "18px auto",
            fontSize: "clamp(42px, 6vw, 72px)",
            lineHeight: "1.05",
            letterSpacing: "-2px",
            color: theme.dark,
          }}
        >
          Professional support built for{" "}
          <span style={{ color: theme.primary }}>newborn families</span>
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: "auto",
            color: theme.text,
            lineHeight: "1.8",
            fontSize: "18px",
          }}
        >
          ANAM FOUNDATION combines newborn care support, member access, grievance
          tracking, and family communication into one warm digital experience.
        </p>
      </section>

      <section
        style={{
          padding: "30px 8% 100px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {services.map((service, index) => (
          <article
            key={service.title}
            style={{
              position: "relative",
              overflow: "hidden",
              padding: "34px",
              minHeight: "280px",
              borderRadius: "32px",
              background: "#ffffff",
              border: `1px solid ${theme.border}`,
              boxShadow: "0 18px 55px rgba(153, 53, 86, 0.12)",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "150px",
                height: "150px",
                right: "-55px",
                top: "-55px",
                borderRadius: "50%",
                background: theme.secondary,
              }}
            ></div>

            <div
              style={{
                width: "58px",
                height: "58px",
                display: "grid",
                placeItems: "center",
                marginBottom: "24px",
                borderRadius: "20px",
                background: theme.secondary,
                color: theme.accent,
                fontWeight: "900",
                fontSize: "20px",
                position: "relative",
                zIndex: 2,
              }}
            >
              {index + 1}
            </div>

            <h3
              style={{
                margin: "0 0 14px",
                color: theme.accent,
                fontSize: "25px",
                position: "relative",
                zIndex: 2,
              }}
            >
              {service.title}
            </h3>

            <p
              style={{
                margin: 0,
                color: theme.text,
                lineHeight: "1.8",
                position: "relative",
                zIndex: 2,
              }}
            >
              {service.text}
            </p>

            <Link
              to="/login"
              style={{
                display: "inline-block",
                marginTop: "24px",
                color: theme.primary,
                fontWeight: "900",
                textDecoration: "none",
                position: "relative",
                zIndex: 2,
              }}
            >
              Access Service →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function PublicRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="live-chat" element={<LiveChat />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}