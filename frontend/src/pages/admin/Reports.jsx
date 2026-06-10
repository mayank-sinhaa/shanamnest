import { useEffect, useState } from "react";
import { supportAPI } from "../../api/api";

export default function Reports() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await supportAPI.adminDashboardStats();
      setStatsData(data);
    } catch (err) {
      setError(
        "Unable to load reports. Please make sure you are logged in with admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const reports = [
    {
      title: "Total Registered Members",
      value: statsData?.users?.total_members || 0,
      text: "Families connected with ShanamNest",
    },
    {
      title: "Total Grievances",
      value: statsData?.grievances?.total || 0,
      text: "All submitted support concerns",
    },
    {
      title: "Pending Cases",
      value: statsData?.grievances?.pending || 0,
      text: "Need admin attention",
    },
    {
      title: "In Progress",
      value: statsData?.grievances?.in_progress || 0,
      text: "Currently under review",
    },
    {
      title: "Resolved Grievances",
      value:
        (statsData?.grievances?.resolved || 0) +
        (statsData?.grievances?.closed || 0),
      text: "Concerns successfully closed",
    },
    {
      title: "Contact Messages",
      value: statsData?.support?.contact_messages || 0,
      text: "Public support messages",
    },
    {
      title: "Live Chat Requests",
      value: statsData?.support?.live_chat_requests || 0,
      text: "Scheduled support chats",
    },
    {
      title: "New Contact Messages",
      value: statsData?.support?.new_contact_messages || 0,
      text: "Unread public queries",
    },
  ];

  const chartData = [
    {
      label: "Members",
      value: statsData?.users?.total_members || 0,
    },
    {
      label: "Grievances",
      value: statsData?.grievances?.total || 0,
    },
    {
      label: "Pending",
      value: statsData?.grievances?.pending || 0,
    },
    {
      label: "Resolved",
      value:
        (statsData?.grievances?.resolved || 0) +
        (statsData?.grievances?.closed || 0),
    },
    {
      label: "Messages",
      value: statsData?.support?.contact_messages || 0,
    },
    {
      label: "Chats",
      value: statsData?.support?.live_chat_requests || 0,
    },
  ];

  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);

  if (loading) {
    return (
      <section style={page}>
        <div style={messageBox}>Loading reports...</div>
      </section>
    );
  }

  return (
    <section style={page}>
      <div style={hero}>
        <p style={tag}>Reports</p>

        <h1 style={heading}>Monitor platform performance</h1>

        <p style={subText}>
          Reports help admin understand member growth, grievance progress,
          public messages, live chat requests and support performance.
        </p>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={grid}>
        {reports.map((item) => (
          <div key={item.title} style={card}>
            <p style={cardTitle}>{item.title}</p>

            <h2 style={value}>{String(item.value).padStart(2, "0")}</h2>

            <span style={text}>{item.text}</span>
          </div>
        ))}
      </div>

      <div style={bigCard}>
        <h2 style={{ margin: "0 0 16px", color: "#28141c" }}>
          Platform Support Summary
        </h2>

        <p style={{ color: "#65535a", lineHeight: "1.8", margin: 0 }}>
          This report is generated from real backend data. It shows current
          platform activity including members, grievances, support messages, and
          live chat requests.
        </p>

        <div style={summaryGrid}>
          <div style={summaryBox}>
            <p style={smallText}>Grievance Progress</p>
            <strong style={{ color: "#993556", fontSize: "24px" }}>
              {statsData?.grievances?.pending || 0} Pending /{" "}
              {statsData?.grievances?.in_progress || 0} In Progress
            </strong>
          </div>

          <div style={summaryBox}>
            <p style={smallText}>Support Requests</p>
            <strong style={{ color: "#993556", fontSize: "24px" }}>
              {statsData?.support?.contact_messages || 0} Messages /{" "}
              {statsData?.support?.live_chat_requests || 0} Chats
            </strong>
          </div>
        </div>

        <div style={chartCard}>
          {chartData.map((item) => {
            const height = Math.max((item.value / maxChartValue) * 180, 14);

            return (
              <div key={item.label} style={chartItem}>
                <div style={barWrap}>
                  <div
                    style={{
                      ...bar,
                      height: `${height}px`,
                    }}
                  ></div>
                </div>

                <strong style={{ color: "#993556" }}>{item.value}</strong>

                <span style={chartLabel}>{item.label}</span>
              </div>
            );
          })}
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
};

const subText = {
  maxWidth: "760px",
  margin: "18px 0 0",
  color: "#ffe6ef",
  lineHeight: "1.8",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "28px",
};

const card = {
  padding: "26px",
  borderRadius: "26px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
};

const cardTitle = {
  margin: "0 0 12px",
  color: "#65535a",
  fontWeight: "800",
};

const value = {
  margin: 0,
  color: "#993556",
  fontSize: "40px",
};

const text = {
  color: "#65535a",
};

const bigCard = {
  padding: "30px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "18px",
  marginTop: "24px",
};

const summaryBox = {
  padding: "22px",
  borderRadius: "22px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
};

const smallText = {
  margin: "0 0 8px",
  color: "#65535a",
  fontSize: "14px",
  fontWeight: "800",
};

const chartCard = {
  minHeight: "260px",
  padding: "24px",
  borderRadius: "24px",
  background: "#fff7fa",
  display: "flex",
  alignItems: "end",
  justifyContent: "space-around",
  gap: "18px",
  marginTop: "24px",
  overflowX: "auto",
};

const chartItem = {
  minWidth: "90px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const barWrap = {
  height: "190px",
  display: "flex",
  alignItems: "end",
};

const bar = {
  width: "54px",
  borderRadius: "18px 18px 0 0",
  background: "linear-gradient(180deg, #d4537e, #993556)",
};

const chartLabel = {
  color: "#65535a",
  fontWeight: "800",
  fontSize: "13px",
  textAlign: "center",
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