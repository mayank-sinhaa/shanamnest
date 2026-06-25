import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export default function SubmitGrievance() {
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    description: "",
    priority: "medium",
    attachment: null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxDescriptionLength = 1000;

  const handleChange = (e) => {
    setError("");
    setSubmitted(false);

    const { name, value, files } = e.target;

    if (name === "attachment") {
      const selectedFile = files[0] || null;

      if (selectedFile) {
        const maxSize = 5 * 1024 * 1024;

        if (selectedFile.size > maxSize) {
          setError("File size must be less than 5 MB.");
          e.target.value = "";
          return;
        }
      }

      setFormData({
        ...formData,
        attachment: selectedFile,
      });

      return;
    }

    if (name === "description") {
      setFormData({
        ...formData,
        description: value.slice(0, maxDescriptionLength),
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.category) {
      return "Please select grievance category.";
    }

    if (!formData.subject.trim()) {
      return "Please enter grievance subject.";
    }

    if (formData.subject.trim().length < 5) {
      return "Subject must be at least 5 characters.";
    }

    if (!formData.description.trim()) {
      return "Please enter grievance description.";
    }

    if (formData.description.trim().length < 20) {
      return "Description must be at least 20 characters.";
    }

    if (!formData.priority) {
      return "Please select priority.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitted(false);
    setCreatedTicket(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setError("Please login again before submitting grievance.");
        return;
      }

      const bodyData = new FormData();
      bodyData.append("category", formData.category);
      bodyData.append("subject", formData.subject.trim());
      bodyData.append("description", formData.description.trim());
      bodyData.append("priority", formData.priority);

      if (formData.attachment) {
        bodyData.append("attachment", formData.attachment);
      }

      const response = await fetch(`${API_BASE_URL}/grievances/submit/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: bodyData,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            data?.non_field_errors?.[0] ||
            Object.values(data || {})?.[0]?.[0] ||
            "Unable to submit grievance."
        );
      }

      setSubmitted(true);
      setCreatedTicket(data);

      setFormData({
        category: "",
        subject: "",
        description: "",
        priority: "medium",
        attachment: null,
      });

      const fileInput = document.getElementById("attachmentInput");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Server connection failed. Please wait a few seconds and try again."
          : err.message || "Unable to submit grievance."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={page}>
      <div style={hero}>
        <div>
          <p style={tag}>Submit Grievance</p>

          <h1 style={heading}>Raise your concern with ANAM FOUNDATION support</h1>

          <p style={subText}>
            Share your issue clearly. Our admin team will review it and reply
            through your member portal.
          </p>
        </div>

        <Link to="/member/my-grievances" style={heroButton}>
          My Grievances
        </Link>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      {submitted && createdTicket && (
        <div style={successBox}>
          <strong>✓ Grievance submitted successfully!</strong>

          <p style={{ margin: "8px 0 14px", lineHeight: "1.7" }}>
            Your ticket ID is <b>#{createdTicket.ticket_id}</b>. You can track
            its status from My Grievances page.
          </p>

          <Link
            to={`/member/my-grievances/${createdTicket.ticket_id}`}
            style={successLink}
          >
            View Grievance
          </Link>
        </div>
      )}

      <div style={mainGrid}>
        <div style={card}>
          <h2 style={cardTitle}>New Grievance Form</h2>

          <form onSubmit={handleSubmit}>
            <div style={formGrid}>
              <div>
                <label style={label}>Grievance Category *</label>
                <select
                  style={input}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  <option value="newborn_care">Newborn Care Support</option>
                  <option value="membership">Membership Issue</option>
                  <option value="service">Service Issue</option>
                  <option value="account">Account / Login Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={label}>Priority *</label>
                <select
                  style={input}
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <label style={label}>Subject *</label>
            <input
              style={input}
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Example: Unable to access member support"
              maxLength="120"
            />

            <div style={labelRow}>
              <label style={label}>Description *</label>

              <span style={charCount}>
                {formData.description.length}/{maxDescriptionLength}
              </span>
            </div>

            <textarea
              style={textarea}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write your concern in detail. Mention what happened, when it happened, and what support you need..."
            ></textarea>

            <label style={label}>Upload File / Proof</label>
            <input
              id="attachmentInput"
              style={fileInput}
              type="file"
              name="attachment"
              onChange={handleChange}
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            />

            {formData.attachment && (
              <div style={fileBox}>
                Selected file: <strong>{formData.attachment.name}</strong>
              </div>
            )}

            <button
              type="submit"
              style={{
                ...button,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Submitting Grievance..." : "Submit Grievance"}
            </button>
          </form>
        </div>

        <div style={sideCard}>
          <h2 style={{ margin: "0 0 18px", color: "#28141c" }}>
            Before submitting
          </h2>

          <div style={tipBox}>
            <strong style={{ color: "#993556" }}>Write clearly</strong>
            <p style={tipText}>
              Add the main issue, date, and any details that help the admin team
              understand your concern.
            </p>
          </div>

          <div style={tipBox}>
            <strong style={{ color: "#993556" }}>Choose right priority</strong>
            <p style={tipText}>
              Use high priority only for urgent support cases. Normal issues can
              be medium priority.
            </p>
          </div>

          <div style={tipBox}>
            <strong style={{ color: "#993556" }}>Attach proof</strong>
            <p style={tipText}>
              You can upload image, PDF or document proof up to 5 MB.
            </p>
          </div>

          <Link to="/member/my-grievances" style={sideLink}>
            Track Submitted Tickets
          </Link>
        </div>
      </div>
    </section>
  );
}

const page = {
  padding: "36px",
  fontFamily: "Arial",
  width: "100%",
  boxSizing: "border-box",
};

const hero = {
  padding: "34px",
  borderRadius: "34px",
  background: "linear-gradient(135deg, #993556, #d4537e)",
  color: "#ffffff",
  boxShadow: "0 24px 70px rgba(153, 53, 86, 0.22)",
  marginBottom: "28px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "24px",
};

const tag = {
  margin: "0 0 12px",
  color: "#ffe6ef",
  fontWeight: "900",
};

const heading = {
  margin: 0,
  fontSize: "42px",
  lineHeight: "1.1",
};

const subText = {
  maxWidth: "760px",
  margin: "18px 0 0",
  color: "#ffe6ef",
  lineHeight: "1.8",
};

const heroButton = {
  padding: "14px 18px",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#993556",
  textDecoration: "none",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1.25fr 0.75fr",
  gap: "24px",
  alignItems: "start",
};

const successBox = {
  width: "100%",
  padding: "18px 22px",
  marginBottom: "22px",
  borderRadius: "22px",
  background: "#e8fff2",
  border: "1px solid #b6edca",
  color: "#1d7a46",
  boxShadow: "0 14px 34px rgba(29, 122, 70, 0.12)",
  boxSizing: "border-box",
};

const errorBox = {
  width: "100%",
  padding: "16px 18px",
  marginBottom: "22px",
  borderRadius: "18px",
  background: "#fff0f3",
  border: "1px solid #f3b6c5",
  color: "#993556",
  fontWeight: "800",
  lineHeight: "1.6",
  boxSizing: "border-box",
};

const successLink = {
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: "999px",
  background: "#1d7a46",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "900",
};

const card = {
  width: "100%",
  padding: "32px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
  boxSizing: "border-box",
};

const sideCard = {
  ...card,
  padding: "28px",
};

const cardTitle = {
  margin: "0 0 24px",
  color: "#28141c",
  fontSize: "30px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
};

const label = {
  display: "block",
  marginBottom: "8px",
  color: "#4d2c38",
  fontWeight: "900",
  fontSize: "14px",
};

const labelRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const charCount = {
  color: "#65535a",
  fontWeight: "800",
  fontSize: "13px",
};

const input = {
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

const fileInput = {
  ...input,
  padding: "14px 16px",
};

const textarea = {
  ...input,
  height: "170px",
  padding: "16px",
  resize: "vertical",
  lineHeight: "1.7",
};

const fileBox = {
  marginTop: "-6px",
  marginBottom: "18px",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#65535a",
  fontWeight: "800",
};

const button = {
  width: "100%",
  height: "56px",
  border: "none",
  borderRadius: "999px",
  background: "#d4537e",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "900",
  boxShadow: "0 14px 34px rgba(212, 83, 126, 0.32)",
};

const tipBox = {
  padding: "18px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  marginBottom: "14px",
};

const tipText = {
  margin: "8px 0 0",
  color: "#65535a",
  lineHeight: "1.7",
};

const sideLink = {
  display: "block",
  width: "100%",
  padding: "15px 18px",
  borderRadius: "999px",
  background: "#d4537e",
  color: "#ffffff",
  textAlign: "center",
  textDecoration: "none",
  fontWeight: "900",
  boxSizing: "border-box",
};