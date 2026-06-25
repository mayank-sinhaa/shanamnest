import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI, grievanceAPI } from "../../api/api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatStatus = (status) => {
    if (status === "pending") return "Pending";
    if (status === "in_progress") return "In Progress";
    if (status === "resolved") return "Resolved";
    if (status === "closed") return "Closed";
    return status || "-";
  };

  const formatServiceType = (serviceType) => {
    if (serviceType === "newborn_care") return "Newborn Care Support";
    if (serviceType === "member_portal") return "Family Member Portal";
    if (serviceType === "grievance_assistance") return "Grievance Assistance";
    return serviceType || "Not selected";
  };

  const formatCategory = (category) => {
    if (category === "newborn_care") return "Newborn Care";
    if (category === "membership") return "Membership";
    if (category === "service") return "Service";
    if (category === "account") return "Account";
    if (category === "other") return "Other";
    return category || "-";
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

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [profileData, grievanceData] = await Promise.all([
        authAPI.profile(),
        grievanceAPI.myGrievances(),
      ]);

      setProfile(profileData);
      setGrievances(grievanceData);
    } catch (err) {
      setError("Unable to load dashboard data. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalGrievances = grievances.length;
  const pendingCount = grievances.filter((item) => item.status === "pending").length;
  const inProgressCount = grievances.filter(
    (item) => item.status === "in_progress"
  ).length;
  const resolvedCount = grievances.filter(
    (item) => item.status === "resolved" || item.status === "closed"
  ).length;

  const recentGrievances = grievances.slice(0, 4);

  const stats = [
    {
      title: "Total Grievances",
      value: String(totalGrievances).padStart(2, "0"),
      text: "All submitted concerns",
    },
    {
      title: "Pending",
      value: String(pendingCount).padStart(2, "0"),
      text: "Waiting for response",
    },
    {
      title: "In Progress",
      value: String(inProgressCount).padStart(2, "0"),
      text: "Currently being reviewed",
    },
    {
      title: "Resolved",
      value: String(resolvedCount).padStart(2, "0"),
      text: "Successfully completed",
    },
  ];

  if (loading) {
    return (
      <section style={page}>
        <div style={messageBox}>Loading dashboard...</div>
      </section>
    );
  }

  return (
    <section style={page}>
      {error && <div style={errorBox}>{error}</div>}

      <div style={hero}>
        <div>
          <p style={tag}>Member Dashboard</p>

          <h1 style={heading}>
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>

          <p style={subText}>
            Track your support requests, grievance status, admin replies and
            profile details in one secure member dashboard.
          </p>

          {profile && (
            <div style={badgeRow}>
              <span style={heroBadge}>{profile.email || "Email not added"}</span>
              <span style={heroBadge}>
                {profile.mobile_number || "Phone not added"}
              </span>
              <span style={heroBadge}>{profile.city || "City not added"}</span>
            </div>
          )}
        </div>

        <Link to="/member/submit-grievance" style={heroButton}>
          + New Grievance
        </Link>
      </div>

      <div style={statsGrid}>
        {stats.map((item) => (
          <div key={item.title} style={statCard}>
            <p style={statTitle}>{item.title}</p>
            <h2 style={statValue}>{item.value}</h2>
            <span style={{ color: "#65535a" }}>{item.text}</span>
          </div>
        ))}
      </div>

      <div style={mainGrid}>
        <div style={card}>
          <div style={sectionHead}>
            <h2 style={{ margin: 0, color: "#28141c" }}>Recent Grievances</h2>

            <Link to="/member/my-grievances" style={smallLink}>
              View All
            </Link>
          </div>

          {recentGrievances.length === 0 ? (
            <div style={emptyBox}>
              <h3 style={{ margin: "0 0 8px", color: "#993556" }}>
                No grievances submitted yet
              </h3>

              <p style={{ margin: 0, color: "#65535a", lineHeight: "1.7" }}>
                You can submit your first grievance from the quick action panel.
              </p>
            </div>
          ) : (
            recentGrievances.map((item) => (
              <Link
                to={`/member/my-grievances/${item.ticket_id}`}
                key={item.ticket_id}
                style={grievanceItem}
              >
                <div>
                  <strong style={{ color: "#993556" }}>#{item.ticket_id}</strong>

                  <h3 style={{ margin: "6px 0", color: "#28141c" }}>
                    {item.subject}
                  </h3>

                  <p style={{ margin: 0, color: "#65535a" }}>
                    {formatCategory(item.category)} • {formatDate(item.created_at)}
                  </p>
                </div>

                <span style={statusStyle(item.status)}>
                  {formatStatus(item.status)}
                </span>
              </Link>
            ))
          )}
        </div>

        <div style={sideGrid}>
          <div style={card}>
            <h2 style={{ margin: "0 0 20px", color: "#28141c" }}>
              Profile Summary
            </h2>

            <div style={profileInfo}>
              <p style={infoLabel}>Full Name</p>
              <strong style={infoValue}>{profile?.full_name || "Member"}</strong>
            </div>

            <div style={profileInfo}>
              <p style={infoLabel}>Service Type</p>
              <strong style={infoValue}>
                {formatServiceType(profile?.service_type)}
              </strong>
            </div>

            <div style={profileInfo}>
              <p style={infoLabel}>Verification</p>
              <span style={verificationStyle(profile?.is_verified)}>
                {profile?.is_verified ? "Verified" : "Not Verified"}
              </span>
            </div>

            <Link to="/member/profile" style={actionBtnOutline}>
              Update Profile
            </Link>
          </div>

          <div style={card}>
            <h2 style={{ margin: "0 0 20px", color: "#28141c" }}>
              Quick Actions
            </h2>

            <Link to="/member/submit-grievance" style={actionBtn}>
              Submit New Grievance
            </Link>

            <Link to="/member/my-grievances" style={actionBtnOutline}>
              View My Grievances
            </Link>

            <div style={supportNote}>
              <strong style={{ color: "#993556" }}>Support Status</strong>

              <p style={{ color: "#65535a", lineHeight: "1.8", marginBottom: 0 }}>
                Your grievances are reviewed by the ShanamNest support team.
                Status and replies will appear in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function statusStyle(status) {
  return {
    padding: "9px 14px",
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

function verificationStyle(isVerified) {
  return {
    display: "inline-block",
    padding: "9px 14px",
    borderRadius: "999px",
    background: isVerified ? "#e8fff2" : "#fbeaf0",
    color: isVerified ? "#1d7a46" : "#993556",
    fontWeight: "900",
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

const badgeRow = {
  marginTop: "22px",
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
};

const heroBadge = {
  padding: "10px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.16)",
  color: "#ffffff",
  fontWeight: "800",
  border: "1px solid rgba(255,255,255,0.25)",
};

const heroButton = {
  padding: "16px 22px",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#993556",
  textDecoration: "none",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
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
};

const sideGrid = {
  display: "grid",
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

const grievanceItem = {
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

const profileInfo = {
  padding: "16px 0",
  borderBottom: "1px solid #f0ccd9",
};

const infoLabel = {
  margin: "0 0 6px",
  color: "#65535a",
  fontWeight: "800",
};

const infoValue = {
  color: "#28141c",
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

const supportNote = {
  marginTop: "28px",
  padding: "22px",
  borderRadius: "22px",
  background: "#fbeaf0",
};

const messageBox = {
  padding: "28px",
  borderRadius: "26px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  color: "#993556",
  fontWeight: "900",
};

const emptyBox = {
  padding: "22px",
  borderRadius: "18px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
};

const errorBox = {
  padding: "16px 18px",
  marginBottom: "22px",
  borderRadius: "18px",
  background: "#fff0f3",
  border: "1px solid #f3b6c5",
  color: "#993556",
  fontWeight: "800",
  lineHeight: "1.6",
};