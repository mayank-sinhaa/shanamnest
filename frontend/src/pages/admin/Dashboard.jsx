import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { grievanceAPI, supportAPI } from "../../api/api";

export default function Dashboard() {
  const [statsData, setStatsData] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [liveChats, setLiveChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatStatus = (status) => {
    if (status === "pending") return "Pending";
    if (status === "in_progress") return "In Progress";
    if (status === "resolved") return "Resolved";
    if (status === "closed") return "Closed";
    if (status === "new") return "New";
    if (status === "read") return "Read";
    if (status === "replied") return "Replied";
    if (status === "scheduled") return "Scheduled";
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";
    return status || "-";
  };

  const formatTopic = (topic) => {
    if (topic === "newborn_care") return "Newborn Care";
    if (topic === "membership") return "Membership";
    if (topic === "grievance") return "Grievance";
    if (topic === "account") return "Account";
    if (topic === "general") return "General";
    return topic || "-";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "-";

    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(Number(hour), Number(minute));

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadAdminDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        dashboardStats,
        grievanceList,
        contactMessageList,
        liveChatList,
      ] = await Promise.all([
        supportAPI.adminDashboardStats(),
        grievanceAPI.adminGrievances(),
        supportAPI.adminContactMessages(),
        supportAPI.adminLiveChats(),
      ]);

      setStatsData(dashboardStats);
      setGrievances(grievanceList.slice(0, 4));
      setContactMessages(contactMessageList.slice(0, 4));
      setLiveChats(liveChatList.slice(0, 4));
    } catch (err) {
      setError(
        "Unable to load admin dashboard. Please make sure you are logged in with admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const stats = [
    {
      title: "Total Members",
      value: statsData?.users?.total_members || 0,
      text: "Registered families",
    },
    {
      title: "Total Grievances",
      value: statsData?.grievances?.total || 0,
      text: "All submitted concerns",
    },
    {
      title: "Pending",
      value: statsData?.grievances?.pending || 0,
      text: "Need admin review",
    },
    {
      title: "Resolved",
      value:
        (statsData?.grievances?.resolved || 0) +
        (statsData?.grievances?.closed || 0),
      text: "Successfully closed",
    },
    {
      title: "Contact Messages",
      value: statsData?.support?.contact_messages || 0,
      text: "Public contact queries",
    },
    {
      title: "Live Chats",
      value: statsData?.support?.live_chat_requests || 0,
      text: "Scheduled chat requests",
    },
  ];

  if (loading) {
    return (
      <section style={page}>
        <div style={messageBox}>Loading admin dashboard...</div>
      </section>
    );
  }

  return (
    <section style={page}>
      <div style={hero}>
        <p style={tag}>Admin Overview</p>

        <h1 style={heading}>Control grievances, members and support replies</h1>

        <p style={subText}>
          This dashboard helps the ANAM FOUNDATION team monitor member issues,
          public messages, live chat requests and support activity.
        </p>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={statsGrid}>
        {stats.map((item) => (
          <div key={item.title} style={statCard}>
            <p style={statTitle}>{item.title}</p>

            <h2 style={statValue}>{String(item.value).padStart(2, "0")}</h2>

            <span style={{ color: "#65535a" }}>{item.text}</span>
          </div>
        ))}
      </div>

      <div style={mainGrid}>
        <div style={card}>
          <div style={sectionHead}>
            <h2 style={{ margin: 0, color: "#28141c" }}>Latest Grievances</h2>

            <Link to="/admin/grievances" style={smallLink}>
              View All
            </Link>
          </div>

          {grievances.length === 0 ? (
            <div style={emptyBox}>No grievances submitted yet.</div>
          ) : (
            grievances.map((item) => (
              <Link
                to={`/admin/grievances/${item.ticket_id}`}
                key={item.ticket_id}
                style={listItem}
              >
                <div>
                  <strong style={{ color: "#993556" }}>#{item.ticket_id}</strong>

                  <h3 style={{ margin: "6px 0", color: "#28141c" }}>
                    {item.subject}
                  </h3>

                  <p style={{ margin: 0, color: "#65535a" }}>
                    {item.member_name || "Member"} • {formatDate(item.created_at)}
                  </p>
                </div>

                <span style={statusStyle(item.status)}>
                  {formatStatus(item.status)}
                </span>
              </Link>
            ))
          )}
        </div>

        <div style={card}>
          <div style={sectionHead}>
            <h2 style={{ margin: 0, color: "#28141c" }}>Quick Actions</h2>
          </div>

          <Link to="/admin/grievances" style={actionBtn}>
            Manage Grievances
          </Link>

          <Link to="/admin/members" style={actionBtnOutline}>
            View Members
          </Link>

          <Link to="/admin/contact-messages" style={actionBtnOutline}>
            Contact Messages
          </Link>

          <Link to="/admin/live-chats" style={actionBtnOutline}>
            Live Chats
          </Link>

          <Link to="/admin/reports" style={actionBtnOutline}>
            View Reports
          </Link>

          <div style={adminNote}>
            <strong style={{ color: "#993556" }}>Admin Note</strong>

            <p style={{ color: "#65535a", lineHeight: "1.8", marginBottom: 0 }}>
              Pending grievances and new contact messages should be reviewed
              first to maintain fast support response.
            </p>
          </div>
        </div>
      </div>

      <div style={bottomGrid}>
        <div style={card}>
          <div style={sectionHead}>
            <h2 style={{ margin: 0, color: "#28141c" }}>
              Recent Contact Messages
            </h2>

            <Link to="/admin/contact-messages" style={smallLink}>
              View All
            </Link>
          </div>

          {contactMessages.length === 0 ? (
            <div style={emptyBox}>No contact messages found.</div>
          ) : (
            contactMessages.map((item) => (
              <div key={item.id} style={simpleItem}>
                <div>
                  <strong style={{ color: "#28141c" }}>{item.full_name}</strong>

                  <p style={{ margin: "6px 0", color: "#993556" }}>
                    {item.subject}
                  </p>

                  <p style={{ margin: 0, color: "#65535a" }}>
                    {item.email} • {formatDate(item.created_at)}
                  </p>
                </div>

                <span style={statusStyle(item.status)}>
                  {formatStatus(item.status)}
                </span>
              </div>
            ))
          )}
        </div>

        <div style={card}>
          <div style={sectionHead}>
            <h2 style={{ margin: 0, color: "#28141c" }}>
              Recent Live Chat Requests
            </h2>

            <Link to="/admin/live-chats" style={smallLink}>
              View All
            </Link>
          </div>

          {liveChats.length === 0 ? (
            <div style={emptyBox}>No live chat requests found.</div>
          ) : (
            liveChats.map((item) => (
              <div key={item.id} style={simpleItem}>
                <div>
                  <strong style={{ color: "#28141c" }}>{item.full_name}</strong>

                  <p style={{ margin: "6px 0", color: "#993556" }}>
                    {formatTopic(item.topic)}
                  </p>

                  <p style={{ margin: 0, color: "#65535a" }}>
                    {formatDate(item.preferred_date)} •{" "}
                    {formatTime(item.preferred_time)}
                  </p>
                </div>

                <span style={statusStyle(item.status)}>
                  {formatStatus(item.status)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function statusStyle(status) {
  return {
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: "900",
    background:
      status === "resolved" ||
      status === "closed" ||
      status === "completed" ||
      status === "replied"
        ? "#e8fff2"
        : status === "pending" ||
          status === "new" ||
          status === "scheduled"
        ? "#fff4df"
        : "#fbeaf0",
    color:
      status === "resolved" ||
      status === "closed" ||
      status === "completed" ||
      status === "replied"
        ? "#1d7a46"
        : status === "pending" ||
          status === "new" ||
          status === "scheduled"
        ? "#936414"
        : "#993556",
    whiteSpace: "nowrap",
    textTransform: "capitalize",
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

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginBottom: "28px",
};

const statCard = {
  padding: "26px",
  borderRadius: "26px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
};

const statTitle = {
  margin: "0 0 12px",
  color: "#65535a",
  fontWeight: "800",
};

const statValue = {
  margin: 0,
  color: "#993556",
  fontSize: "40px",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1.15fr 0.85fr",
  gap: "24px",
  marginBottom: "24px",
};

const bottomGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "24px",
};

const card = {
  padding: "28px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
};

const sectionHead = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  marginBottom: "20px",
};

const smallLink = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#993556",
  textDecoration: "none",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const listItem = {
  padding: "18px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  marginBottom: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  textDecoration: "none",
};

const simpleItem = {
  padding: "18px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  marginBottom: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
};

const actionBtn = {
  display: "block",
  width: "100%",
  padding: "16px 18px",
  marginBottom: "14px",
  borderRadius: "999px",
  background: "#d4537e",
  color: "#ffffff",
  textAlign: "center",
  textDecoration: "none",
  fontWeight: "900",
  boxSizing: "border-box",
};

const actionBtnOutline = {
  ...actionBtn,
  background: "#fff7fa",
  color: "#993556",
  border: "1px solid #f0ccd9",
};

const adminNote = {
  marginTop: "28px",
  padding: "22px",
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

const emptyBox = {
  padding: "22px",
  borderRadius: "20px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#65535a",
  fontWeight: "800",
};