import { useState } from "react";
import { Link } from "react-router-dom";
import { supportAPI } from "../../api/api";

export default function LiveChat() {
  const [scheduled, setScheduled] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    topic: "",
    preferred_date: "",
    preferred_time: "",
    message: "",
  });

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  const todayDate = getTodayDate();
  const currentTime = getCurrentTime();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setError("");
    setScheduled(false);

    if (name === "phone") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

      setFormData({
        ...formData,
        phone: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSchedule = async () => {
    setError("");
    setScheduled(false);

    if (
      !formData.full_name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.topic ||
      !formData.preferred_date ||
      !formData.preferred_time
    ) {
      setError("Please fill name, mobile, email, topic, date and time.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid 10 digit Indian mobile number.");
      return;
    }

    const selectedDateTime = new Date(
      `${formData.preferred_date}T${formData.preferred_time}`
    );
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
      setError("Please select only future date and time for live chat.");
      return;
    }

    try {
      setLoading(true);

      await supportAPI.liveChat(formData);

      setScheduled(true);

      setFormData({
        full_name: "",
        phone: "",
        email: "",
        topic: "",
        preferred_date: "",
        preferred_time: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Unable to schedule live chat.");
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
          "radial-gradient(circle at top left, #fbeaf0 0, transparent 34%), linear-gradient(135deg, #fff7fa 0%, #ffffff 55%, #fbeaf0 100%)",
      }}
    >
      <section
        style={{
          padding: "95px 8% 70px",
          display: "grid",
          gridTemplateColumns: "0.95fr 1.05fr",
          gap: "54px",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              width: "fit-content",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "#fbeaf0",
              color: "#993556",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            Live Chat Scheduling
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(44px, 6vw, 76px)",
              lineHeight: "1.05",
              letterSpacing: "-2px",
              color: "#28141c",
            }}
          >
            Schedule a live chat with{" "}
            <span style={{ color: "#d4537e" }}>ShanamNest support</span>
          </h1>

          <p
            style={{
              margin: "26px 0 34px",
              color: "#65535a",
              lineHeight: "1.8",
              fontSize: "18px",
              maxWidth: "720px",
            }}
          >
            Choose your preferred date and time for live support. Our team will
            connect with you for membership help, newborn care support,
            grievance guidance or general queries.
          </p>

          <div
            style={{
              display: "grid",
              gap: "16px",
              maxWidth: "620px",
            }}
          >
            <Feature
              title="✓ Choose your time"
              text="Select a comfortable future date and time for live support."
            />

            <Feature
              title="✓ Get guided support"
              text="Discuss membership, services, grievances or account issues."
            />

            <Feature
              title="✓ Family-friendly help"
              text="Designed for smooth communication with newborn families."
            />
          </div>
        </div>

        <div
          style={{
            padding: "38px",
            borderRadius: "34px",
            background: "#ffffff",
            border: "1px solid #f0ccd9",
            boxShadow: "0 28px 80px rgba(153, 53, 86, 0.18)",
          }}
        >
          <div style={{ marginBottom: "28px" }}>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "34px",
                color: "#28141c",
              }}
            >
              Schedule Live Chat
            </h2>

            <p style={{ margin: 0, color: "#65535a" }}>
              Fill the details and select your preferred future chat slot.
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

          {scheduled && (
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
              ✓ Live chat request scheduled successfully! Our support team will
              contact you at your selected time.
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
                  name="phone"
                  value={formData.phone}
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

            <label style={labelStyle}>Chat Topic</label>
            <select
              style={inputStyle}
              name="topic"
              value={formData.topic}
              onChange={handleChange}
            >
              <option value="">Select chat topic</option>
              <option value="newborn_care">Newborn Care Support</option>
              <option value="membership">Membership Help</option>
              <option value="grievance">Grievance Guidance</option>
              <option value="account">Account / Login Issue</option>
              <option value="general">General Support</option>
            </select>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
              }}
            >
              <div>
                <label style={labelStyle}>Preferred Date</label>
                <input
                  style={inputStyle}
                  type="date"
                  name="preferred_date"
                  min={todayDate}
                  value={formData.preferred_date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={labelStyle}>Preferred Time</label>
                <input
                  style={inputStyle}
                  type="time"
                  name="preferred_time"
                  min={
                    formData.preferred_date === todayDate
                      ? currentTime
                      : undefined
                  }
                  value={formData.preferred_time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label style={labelStyle}>Message</label>
            <textarea
              style={textareaStyle}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write what you want to discuss..."
            ></textarea>

            <button
              type="button"
              onClick={handleSchedule}
              disabled={loading}
              style={{
                width: "100%",
                height: "56px",
                border: "none",
                borderRadius: "999px",
                background: "#d4537e",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "900",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
                boxShadow: "0 14px 34px rgba(212, 83, 126, 0.32)",
              }}
            >
              {loading ? "Scheduling..." : "Schedule Live Chat"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              color: "#65535a",
            }}
          >
            Already a member?{" "}
            <Link
              to="/login"
              style={{
                color: "#d4537e",
                fontWeight: "900",
                textDecoration: "none",
              }}
            >
              Login to portal
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, text }) {
  return (
    <div
      style={{
        padding: "22px",
        borderRadius: "26px",
        background: "rgba(255,255,255,0.78)",
        border: "1px solid #f0ccd9",
        boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
      }}
    >
      <strong style={{ color: "#993556", fontSize: "18px" }}>{title}</strong>
      <p style={{ margin: "8px 0 0", color: "#65535a", lineHeight: "1.7" }}>
        {text}
      </p>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#4d2c38",
  fontWeight: "900",
  fontSize: "14px",
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

const textareaStyle = {
  ...inputStyle,
  height: "140px",
  padding: "16px",
  resize: "vertical",
};