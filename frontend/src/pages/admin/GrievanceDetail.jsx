import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { grievanceAPI } from "../../api/api";

export default function GrievanceDetail() {
  const { id } = useParams();

  const [grievance, setGrievance] = useState(null);
  const [formData, setFormData] = useState({
    status: "",
    priority: "",
    admin_note: "",
    reply: "",
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [replying, setReplying] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formatStatus = (status) => {
    if (status === "pending") return "Pending";
    if (status === "in_progress") return "In Progress";
    if (status === "resolved") return "Resolved";
    if (status === "closed") return "Closed";
    return status;
  };

  const formatCategory = (category) => {
    if (category === "newborn_care") return "Newborn Care Support";
    if (category === "membership") return "Membership Issue";
    if (category === "service") return "Service Issue";
    if (category === "account") return "Account / Login Issue";
    if (category === "other") return "Other";
    return category;
  };

  const formatPriority = (priority) => {
    if (priority === "high") return "High";
    if (priority === "medium") return "Medium";
    if (priority === "low") return "Low";
    return priority;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadGrievanceDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await grievanceAPI.myGrievanceDetail(id);

      setGrievance(data);
      setFormData({
        status: data.status || "pending",
        priority: data.priority || "medium",
        admin_note: data.admin_note || "",
        reply: "",
      });
    } catch (err) {
      setError(
        "Unable to load grievance details. Please make sure you are logged in with admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAdminGrievanceDetail = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetch(`http://127.0.0.1:8000/api/grievances/admin/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const result = await data.json();

      if (!data.ok) {
        throw new Error(result?.detail || "Unable to load grievance details.");
      }

      setGrievance(result);
      setFormData({
        status: result.status || "pending",
        priority: result.priority || "medium",
        admin_note: result.admin_note || "",
        reply: "",
      });
    } catch (err) {
      setError(
        err.message ||
          "Unable to load grievance details. Please make sure you are logged in with admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminGrievanceDetail();
  }, [id]);

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateStatus = async () => {
    setError("");
    setSuccess("");

    try {
      setUpdating(true);

      const updatedData = await grievanceAPI.adminUpdateGrievance(id, {
        status: formData.status,
        priority: formData.priority,
        admin_note: formData.admin_note,
      });

      setGrievance({
        ...grievance,
        ...updatedData,
      });

      setSuccess("Grievance status updated successfully.");

      await loadAdminGrievanceDetail();
    } catch (err) {
      setError(err.message || "Unable to update grievance.");
    } finally {
      setUpdating(false);
    }
  };

  const handleSendReply = async () => {
    setError("");
    setSuccess("");

    if (!formData.reply.trim()) {
      setError("Please write a reply before sending.");
      return;
    }

    try {
      setReplying(true);

      await grievanceAPI.adminReply(id, {
        message: formData.reply,
      });

      setSuccess("Reply sent successfully.");

      setFormData({
        ...formData,
        reply: "",
      });

      await loadAdminGrievanceDetail();
    } catch (err) {
      setError(err.message || "Unable to send reply.");
    } finally {
      setReplying(false);
    }
  };

  if (loading) {
    return (
      <section style={page}>
        <div style={messageBox}>Loading grievance details...</div>
      </section>
    );
  }

  if (error && !grievance) {
    return (
      <section style={page}>
        <div style={errorBox}>{error}</div>

        <Link to="/admin/grievances" style={backSmallBtn}>
          ← Back to Grievances
        </Link>
      </section>
    );
  }

  return (
    <section style={page}>
      <div style={hero}>
        <div>
          <p style={tag}>Grievance Details</p>

          <h1 style={heading}>Review complaint and send official reply</h1>

          <p style={subText}>
            Admin can view member issue details, update grievance status, and
            communicate with the member.
          </p>
        </div>

        <Link to="/admin/grievances" style={backBtn}>
          ← Back
        </Link>
      </div>

      {error && <div style={errorBox}>{error}</div>}
      {success && <div style={successBox}>✓ {success}</div>}

      <div style={grid}>
        <div style={mainCard}>
          <div style={topLine}>
            <div>
              <p style={smallText}>Grievance ID</p>

              <h2 style={title}>#{grievance.ticket_id}</h2>
            </div>

            <span style={statusStyle(grievance.status)}>
              {formatStatus(grievance.status)}
            </span>
          </div>

          <div style={infoGrid}>
            <Info title="Member Name" value={grievance.member_name || "Member"} />

            <Info title="Email" value={grievance.member_email} />

            <Info title="Category" value={formatCategory(grievance.category)} />

            <Info title="Priority" value={formatPriority(grievance.priority)} />

            <Info title="Submitted On" value={formatDateTime(grievance.created_at)} />

            <Info title="Last Updated" value={formatDateTime(grievance.updated_at)} />
          </div>

          <div style={complaintBox}>
            <p style={smallText}>Subject</p>

            <h3 style={{ margin: "6px 0 14px", color: "#28141c" }}>
              {grievance.subject}
            </h3>

            <p style={{ color: "#65535a", lineHeight: "1.8", margin: 0 }}>
              {grievance.description}
            </p>
          </div>

          {grievance.admin_note && (
            <div style={adminNoteBox}>
              <p style={smallText}>Admin Note</p>

              <p style={{ color: "#4d2c38", lineHeight: "1.8", margin: 0 }}>
                {grievance.admin_note}
              </p>
            </div>
          )}

          <div style={replySection}>
            <h2 style={{ margin: "0 0 20px", color: "#28141c" }}>
              Conversation
            </h2>

            <Reply
              from="Member"
              message={grievance.description}
              time={formatDateTime(grievance.created_at)}
            />

            {grievance.replies && grievance.replies.length > 0 ? (
              grievance.replies.map((reply) => (
                <Reply
                  key={reply.id}
                  from={reply.is_admin_reply ? "Admin" : "Member"}
                  message={reply.message}
                  time={formatDateTime(reply.created_at)}
                />
              ))
            ) : (
              <div style={noReplyBox}>No admin reply sent yet.</div>
            )}
          </div>
        </div>

        <aside style={sideCard}>
          <h2 style={{ margin: "0 0 20px", color: "#28141c" }}>
            Admin Action
          </h2>

          <label style={label}>Update Status</label>
          <select
            style={input}
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <label style={label}>Priority</label>
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

          <label style={label}>Admin Note</label>
          <textarea
            style={textarea}
            name="admin_note"
            value={formData.admin_note}
            onChange={handleChange}
            placeholder="Write internal/admin note..."
          ></textarea>

          <button
            type="button"
            style={{
              ...button,
              opacity: updating ? 0.75 : 1,
              cursor: updating ? "not-allowed" : "pointer",
              marginBottom: "20px",
            }}
            onClick={handleUpdateStatus}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>

          <label style={label}>Admin Reply</label>
          <textarea
            style={textarea}
            name="reply"
            value={formData.reply}
            onChange={handleChange}
            placeholder="Write official reply to member..."
          ></textarea>

          <button
            type="button"
            style={{
              ...button,
              opacity: replying ? 0.75 : 1,
              cursor: replying ? "not-allowed" : "pointer",
            }}
            onClick={handleSendReply}
            disabled={replying}
          >
            {replying ? "Sending..." : "Send Reply"}
          </button>

          <div style={noteBox}>
            <strong style={{ color: "#993556" }}>Note</strong>

            <p style={{ color: "#65535a", lineHeight: "1.7" }}>
              Status updates and replies will be saved in backend database and
              visible to the member.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Info({ title, value }) {
  return (
    <div style={infoBox}>
      <p style={smallText}>{title}</p>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function Reply({ from, message, time }) {
  return (
    <div
      style={{
        ...replyBox,
        background: from === "Admin" ? "#fbeaf0" : "#fff7fa",
        marginLeft: from === "Admin" ? "40px" : "0",
      }}
    >
      <strong style={{ color: "#993556" }}>{from}</strong>

      <p style={{ color: "#4d2c38", lineHeight: "1.7" }}>{message}</p>

      <span style={{ color: "#65535a", fontSize: "13px" }}>{time}</span>
    </div>
  );
}

function statusStyle(status) {
  return {
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "900",
    background:
      status === "resolved" || status === "closed"
        ? "#e8fff2"
        : status === "pending"
        ? "#fff4df"
        : "#fbeaf0",
    color:
      status === "resolved" || status === "closed"
        ? "#1d7a46"
        : status === "pending"
        ? "#936414"
        : "#993556",
    whiteSpace: "nowrap",
  };
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
  background: "linear-gradient(135deg, #28141c, #993556)",
  color: "#ffffff",
  boxShadow: "0 24px 70px rgba(40, 20, 28, 0.25)",
  marginBottom: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "24px",
};

const tag = {
  margin: "0 0 12px",
  color: "#ffd8e6",
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

const backBtn = {
  padding: "14px 20px",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#993556",
  textDecoration: "none",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const backSmallBtn = {
  display: "inline-block",
  marginTop: "18px",
  padding: "12px 18px",
  borderRadius: "999px",
  background: "#d4537e",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "900",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: "24px",
};

const mainCard = {
  padding: "30px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
};

const sideCard = {
  padding: "30px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
  height: "fit-content",
};

const topLine = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "24px",
};

const title = {
  margin: 0,
  color: "#993556",
  fontSize: "34px",
};

const smallText = {
  margin: "0 0 6px",
  color: "#65535a",
  fontSize: "14px",
  fontWeight: "800",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
  marginBottom: "24px",
};

const infoBox = {
  padding: "18px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#28141c",
};

const complaintBox = {
  padding: "22px",
  borderRadius: "22px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  marginBottom: "26px",
};

const adminNoteBox = {
  padding: "22px",
  borderRadius: "22px",
  background: "#fbeaf0",
  border: "1px solid #f0ccd9",
  marginBottom: "26px",
};

const replySection = {
  marginTop: "10px",
};

const replyBox = {
  padding: "18px",
  borderRadius: "20px",
  border: "1px solid #f0ccd9",
  marginBottom: "14px",
};

const noReplyBox = {
  padding: "18px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#65535a",
  fontWeight: "800",
};

const label = {
  display: "block",
  marginBottom: "8px",
  color: "#4d2c38",
  fontWeight: "900",
  fontSize: "14px",
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

const textarea = {
  ...input,
  height: "140px",
  padding: "16px",
  resize: "vertical",
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

const noteBox = {
  marginTop: "24px",
  padding: "20px",
  borderRadius: "22px",
  background: "#fbeaf0",
};

const messageBox = {
  padding: "22px",
  borderRadius: "22px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  color: "#993556",
  fontWeight: "900",
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

const successBox = {
  width: "100%",
  padding: "16px 18px",
  marginBottom: "22px",
  borderRadius: "18px",
  background: "#e8fff2",
  border: "1px solid #b6edca",
  color: "#1d7a46",
  fontWeight: "800",
  lineHeight: "1.6",
  boxSizing: "border-box",
};