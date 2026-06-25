import { useState } from "react";
import { Link } from "react-router-dom";
import { supportAPI } from "../../api/api";

export default function Contact() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setSent(false);

    const { name, value } = e.target;

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

  const handleSend = async () => {
    setError("");
    setSent(false);

    if (
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError("Please fill name, email, support type and message.");
      return;
    }

    if (formData.phone && !/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Please enter a valid 10 digit Indian mobile number.");
      return;
    }

    try {
      setLoading(true);

      await supportAPI.contact(formData);

      setSent(true);

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(err.message || "Unable to send message.");
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      title: "Email Support",
      value: "support@shanamnest.org",
      text: "Send your queries or support requests anytime.",
    },
    {
      title: "Member Helpdesk",
      value: "+91 98765 43210",
      text: "Reach our support team for member-related help.",
    },
    {
      title: "Service Area",
      value: "India",
      text: "Digital support platform for newborn families.",
    },
  ];

  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
        fontFamily: "Arial",
        background:
          "radial-gradient(circle at top right, #fbeaf0 0, transparent 32%), linear-gradient(135deg, #fff7fa 0%, #ffffff 55%, #fbeaf0 100%)",
      }}
    >
      <section
        style={{
          padding: "95px 8% 60px",
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
            Contact Support
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
            We are here to support{" "}
            <span style={{ color: "#d4537e" }}>your family</span>
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
            Have a question about membership, services, grievance tracking or
            newborn care support? Contact the ANAM FOUNDATION team and we will guide
            you.
          </p>

          <div style={{ display: "grid", gap: "16px", maxWidth: "620px" }}>
            {contactCards.map((card) => (
              <div
                key={card.title}
                style={{
                  padding: "22px",
                  borderRadius: "26px",
                  background: "rgba(255,255,255,0.78)",
                  border: "1px solid #f0ccd9",
                  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
                }}
              >
                <strong style={{ color: "#993556", fontSize: "18px" }}>
                  {card.title}
                </strong>

                <h3
                  style={{
                    margin: "8px 0",
                    color: "#28141c",
                    fontSize: "24px",
                  }}
                >
                  {card.value}
                </h3>

                <p style={{ margin: 0, color: "#65535a", lineHeight: "1.7" }}>
                  {card.text}
                </p>
              </div>
            ))}
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
              Send us a message
            </h2>

            <p style={{ margin: 0, color: "#65535a" }}>
              Fill the form and our support team will contact you.
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

          {sent && (
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
              ✓ Message sent successfully! Our team will contact you soon.
            </div>
          )}

          <form>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
            />

            <label style={labelStyle}>Email Address</label>
            <input
              style={inputStyle}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />

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

            <label style={labelStyle}>Support Type</label>
            <select
              style={inputStyle}
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            >
              <option value="">Select support type</option>
              <option value="Membership Help">Membership Help</option>
              <option value="Newborn Care Support">
                Newborn Care Support
              </option>
              <option value="Grievance Help">Grievance Help</option>
              <option value="Technical Issue">Technical Issue</option>
              <option value="Other">Other</option>
            </select>

            <label style={labelStyle}>Message</label>
            <textarea
              style={textareaStyle}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
            ></textarea>

            <button
              type="button"
              onClick={handleSend}
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
              {loading ? "Sending..." : "Send Message"}
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

      <section
        style={{
          padding: "20px 8% 100px",
        }}
      >
        <div
          style={{
            padding: "36px",
            borderRadius: "34px",
            background: "linear-gradient(135deg, #28141c, #993556)",
            color: "#ffffff",
            boxShadow: "0 24px 70px rgba(40, 20, 28, 0.22)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "28px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 12px",
                color: "#ffd8e6",
                fontWeight: "900",
              }}
            >
              Need faster help?
            </p>

            <h2 style={{ margin: 0, fontSize: "40px", lineHeight: "1.1" }}>
              Members can submit grievances directly from dashboard
            </h2>

            <p
              style={{
                margin: "16px 0 0",
                color: "#ffe6ef",
                lineHeight: "1.8",
                maxWidth: "760px",
              }}
            >
              Login to your member portal to submit and track support requests
              with status updates.
            </p>
          </div>

          <Link
            to="/login"
            style={{
              padding: "16px 24px",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#993556",
              textDecoration: "none",
              fontWeight: "900",
              whiteSpace: "nowrap",
            }}
          >
            Member Login
          </Link>
        </div>
      </section>
    </main>
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