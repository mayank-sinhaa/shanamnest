import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { grievanceAPI } from "../../api/api";

export default function GrievanceDetail() {
  const { id } = useParams();

  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatStatus = (status) => {
    if (status === "pending") return "Pending";
    if (status === "in_progress") return "In Progress";
    if (status === "resolved") return "Resolved";
    if (status === "closed") return "Closed";
    return status || "-";
  };

  const formatCategory = (category) => {
    if (category === "newborn_care") return "Newborn Care Support";
    if (category === "membership") return "Membership Issue";
    if (category === "service") return "Service Issue";
    if (category === "account") return "Account / Login Issue";
    if (category === "other") return "Other";
    return category || "-";
  };

  const formatPriority = (priority) => {
    if (priority === "high") return "High";
    if (priority === "medium") return "Medium";
    if (priority === "low") return "Low";
    return priority || "-";
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
    } catch (err) {
      setError("Unable to load grievance details. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievanceDetail();
  }, [id]);

  if (loading) {
    return (
      <section style={page}>
        <div style={messageBox}>Loading grievance details...</div>
      </section>
    );
  }

  if (error || !grievance) {
    return (
      <section style={page}>
        <div style={errorBox}>{error || "Grievance not found."}</div>

        <Link to="/member/my-grievances" style={backSmallBtn}>
          ← Back to My Grievances
        </Link>
      </section>
    );
  }

  const isSubmittedActive = true;
  const isReviewActive =
    grievance.status === "in_progress" ||
    grievance.status === "resolved" ||
    grievance.status === "closed";
  const isResolvedActive =
    grievance.status === "resolved" || grievance.status === "closed";

  return (
    <section style={page}>
      <div style={hero}>
        <div>
          <p style={tag}>Grievance Details</p>

          <h1 style={heading}>Track your support request</h1>

          <p style={subText}>
            View your grievance details, current status, admin note, attachment
            and official replies from the ANAM FOUNDATION support team.
          </p>
        </div>

        <Link to="/member/my-grievances" style={backBtn}>
          ← Back
        </Link>
      </div>

      <div style={mainGrid}>
        <div style={mainCard}>
          <div style={ticketHeader}>
            <div>
              <p style={smallText}>Grievance ID</p>

              <h2 style={ticketTitle}>#{grievance.ticket_id}</h2>
            </div>

            <span style={statusStyle(grievance.status)}>
              {formatStatus(grievance.status)}
            </span>
          </div>

          <div style={infoGrid}>
            <Info title="Subject" value={grievance.subject} />
            <Info title="Category" value={formatCategory(grievance.category)} />
            <Info title="Submitted On" value={formatDateTime(grievance.created_at)} />
            <Info title="Last Updated" value={formatDateTime(grievance.updated_at)} />

            <div style={infoBox}>
              <p style={smallText}>Priority</p>
              <span style={priorityStyle(grievance.priority)}>
                {formatPriority(grievance.priority)}
              </span>
            </div>

            <Info title="Member Email" value={grievance.member_email} />
          </div>

          <div style={complaintBox}>
            <p style={smallText}>Your Complaint</p>

            <h3 style={{ margin: "6px 0 14px", color: "#28141c" }}>
              {grievance.subject}
            </h3>

            <p style={{ color: "#65535a", lineHeight: "1.8", margin: 0 }}>
              {grievance.description}
            </p>
          </div>

          {grievance.attachment ? (
            <div style={attachmentBox}>
              <div>
                <p style={smallText}>Attachment</p>

                <strong style={{ color: "#28141c" }}>
                  Proof file uploaded with this grievance
                </strong>
              </div>

              <a
                href={grievance.attachment}
                target="_blank"
                rel="noreferrer"
                style={attachmentLink}
              >
                Open File
              </a>
            </div>
          ) : (
            <div style={noAttachmentBox}>
              No attachment was uploaded with this grievance.
            </div>
          )}

          {grievance.admin_note && (
            <div style={adminNoteBox}>
              <p style={smallText}>Admin Note</p>

              <p style={{ color: "#4d2c38", lineHeight: "1.8", margin: 0 }}>
                {grievance.admin_note}
              </p>
            </div>
          )}

          <div style={sectionHead}>
            <h2 style={{ margin: 0, color: "#28141c" }}>Conversation</h2>

            <span style={replyCount}>
              {grievance.replies?.length || 0} admin reply
              {(grievance.replies?.length || 0) === 1 ? "" : "ies"}
            </span>
          </div>

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
            <div style={noReplyBox}>
              No admin reply yet. Please wait for the support team response.
            </div>
          )}
        </div>

        <aside style={sideCard}>
          <h2 style={{ margin: "0 0 20px", color: "#28141c" }}>
            Support Status
          </h2>

          <div style={currentStatusBox}>
            <p style={smallText}>Current Status</p>

            <strong style={{ color: "#993556", fontSize: "24px" }}>
              {formatStatus(grievance.status)}
            </strong>
          </div>

          <StatusStep
            active={isSubmittedActive}
            title="Submitted"
            text="Your grievance has been submitted successfully."
          />

          <StatusStep
            active={isReviewActive}
            title="Under Review"
            text="Admin team is checking your concern."
          />

          <StatusStep
            active={isResolvedActive}
            title="Resolved"
            text="Final solution will be shared here."
          />

          <div style={helpBox}>
            <strong style={{ color: "#993556" }}>Need Help?</strong>

            <p style={{ color: "#65535a", lineHeight: "1.7", marginBottom: 0 }}>
              Please wait for admin response. Your grievance is being reviewed
              by the ANAM FOUNDATION support team.
            </p>
          </div>

          <Link to="/member/submit-grievance" style={sideBtn}>
            Submit Another Grievance
          </Link>
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
  const isAdmin = from === "Admin";

  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "20px",
        border: "1px solid #f0ccd9",
        marginBottom: "14px",
        background: isAdmin ? "#fbeaf0" : "#fff7fa",
        marginLeft: isAdmin ? "40px" : "0",
      }}
    >
      <div style={replyHeader}>
        <strong style={{ color: "#993556" }}>{from}</strong>

        <span style={{ color: "#65535a", fontSize: "13px", fontWeight: "800" }}>
          {time}
        </span>
      </div>

      <p style={{ color: "#4d2c38", lineHeight: "1.7", marginBottom: 0 }}>
        {message}
      </p>
    </div>
  );
}

function StatusStep({ active, title, text }) {
  return (
    <div style={statusStep}>
      <span
        style={{
          width: "14px",
          height: "14px",
          marginTop: "4px",
          borderRadius: "50%",
          background: active ? "#d4537e" : "#d9c5cd",
        }}
      ></span>

      <div>
        <strong style={{ color: active ? "#28141c" : "#8a747d" }}>
          {title}
        </strong>

        <p style={{ margin: "6px 0 0", color: "#65535a", lineHeight: "1.6" }}>
          {text}
        </p>
      </div>
    </div>
  );
}

function statusStyle(status) {
  return {
    padding: "10px 16px",
    borderRadius: "999px",
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
    fontWeight: "900",
    whiteSpace: "nowrap",
  };
}

function priorityStyle(priority) {
  return {
    display: "inline-block",
    padding: "8px 13px",
    borderRadius: "999px",
    fontWeight: "900",
    textTransform: "capitalize",
    background:
      priority === "high"
        ? "#fff0f3"
        : priority === "low"
        ? "#e8fff2"
        : "#fff4df",
    color:
      priority === "high"
        ? "#993556"
        : priority === "low"
        ? "#1d7a46"
        : "#936414",
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
  background: "linear-gradient(135deg, #993556, #d4537e)",
  color: "#ffffff",
  boxShadow: "0 24px 70px rgba(153, 53, 86, 0.22)",
  marginBottom: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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

const mainGrid = {
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

const ticketHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "24px",
  gap: "18px",
};

const ticketTitle = {
  margin: 0,
  color: "#993556",
  fontSize: "34px",
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
  marginBottom: "20px",
};

const attachmentBox = {
  padding: "18px",
  borderRadius: "20px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  marginBottom: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "18px",
};

const noAttachmentBox = {
  padding: "16px 18px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#65535a",
  fontWeight: "800",
  marginBottom: "20px",
};

const attachmentLink = {
  padding: "10px 16px",
  borderRadius: "999px",
  background: "#d4537e",
  color: "#ffffff",
  textDecoration: "none",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const adminNoteBox = {
  padding: "22px",
  borderRadius: "22px",
  background: "#fbeaf0",
  border: "1px solid #f0ccd9",
  marginBottom: "26px",
};

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  marginBottom: "20px",
};

const replyCount = {
  padding: "9px 14px",
  borderRadius: "999px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#993556",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const replyHeader = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "center",
};

const noReplyBox = {
  padding: "18px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#65535a",
  fontWeight: "800",
};

const sideCard = {
  padding: "30px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
  height: "fit-content",
};

const currentStatusBox = {
  padding: "20px",
  borderRadius: "22px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  marginBottom: "24px",
};

const statusStep = {
  display: "grid",
  gridTemplateColumns: "18px 1fr",
  gap: "14px",
  marginBottom: "18px",
};

const helpBox = {
  marginTop: "24px",
  padding: "20px",
  borderRadius: "22px",
  background: "#fbeaf0",
};

const sideBtn = {
  display: "block",
  marginTop: "18px",
  padding: "14px 18px",
  borderRadius: "999px",
  background: "#d4537e",
  color: "#ffffff",
  textDecoration: "none",
  textAlign: "center",
  fontWeight: "900",
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
  marginBottom: "20px",
  borderRadius: "18px",
  background: "#fff0f3",
  border: "1px solid #f3b6c5",
  color: "#993556",
  fontWeight: "800",
  lineHeight: "1.6",
  boxSizing: "border-box",
};

const smallText = {
  margin: "0 0 6px",
  color: "#65535a",
  fontSize: "14px",
  fontWeight: "800",
};