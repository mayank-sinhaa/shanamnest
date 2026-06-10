import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { grievanceAPI } from "../../api/api";

export default function Grievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const loadGrievances = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await grievanceAPI.adminGrievances();
      setGrievances(data);
    } catch (err) {
      setError(
        "Unable to load grievances. Please make sure you are logged in with admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  const filteredGrievances = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return grievances.filter((item) => {
      const matchesSearch =
        !search ||
        item.ticket_id?.toLowerCase().includes(search) ||
        item.subject?.toLowerCase().includes(search) ||
        item.member_name?.toLowerCase().includes(search) ||
        item.member_email?.toLowerCase().includes(search) ||
        item.category?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [grievances, searchTerm, statusFilter, priorityFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  return (
    <section style={page}>
      <div style={hero}>
        <p style={tag}>Manage Grievances</p>

        <h1 style={heading}>Review and update member grievances</h1>

        <p style={subText}>
          Admin can search complaints, filter by status or priority, update
          progress status, and manage support responses from one place.
        </p>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={filterCard}>
        <div>
          <label style={label}>Search Grievance</label>
          <input
            style={input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticket, subject, member or email"
          />
        </div>

        <div>
          <label style={label}>Status</label>
          <select
            style={select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label style={label}>Priority</label>
          <select
            style={select}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={filterActions}>
          <p style={countText}>
            Showing{" "}
            <strong style={{ color: "#993556" }}>
              {filteredGrievances.length}
            </strong>{" "}
            of{" "}
            <strong style={{ color: "#993556" }}>{grievances.length}</strong>
          </p>

          <button type="button" onClick={clearFilters} style={clearBtn}>
            Clear Filters
          </button>
        </div>
      </div>

      <div style={tableCard}>
        {loading ? (
          <div style={messageBox}>Loading grievances...</div>
        ) : grievances.length === 0 ? (
          <div style={emptyBox}>No grievances submitted yet.</div>
        ) : filteredGrievances.length === 0 ? (
          <div style={emptyBox}>No grievances matched your filters.</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Member</th>
                <th style={th}>Subject</th>
                <th style={th}>Category</th>
                <th style={th}>Priority</th>
                <th style={th}>Date</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredGrievances.map((item) => (
                <tr key={item.ticket_id}>
                  <td style={td}>#{item.ticket_id}</td>

                  <td style={td}>
                    <strong>{item.member_name || "Member"}</strong>
                    <p style={{ margin: "4px 0 0", color: "#65535a" }}>
                      {item.member_email || "-"}
                    </p>
                  </td>

                  <td style={{ ...td, minWidth: "220px" }}>{item.subject}</td>

                  <td style={td}>{formatCategory(item.category)}</td>

                  <td style={td}>
                    <span style={priorityStyle(item.priority)}>
                      {item.priority || "-"}
                    </span>
                  </td>

                  <td style={td}>{formatDate(item.created_at)}</td>

                  <td style={td}>
                    <span style={statusStyle(item.status)}>
                      {formatStatus(item.status)}
                    </span>
                  </td>

                  <td style={td}>
                    <Link
                      to={`/admin/grievances/${item.ticket_id}`}
                      style={viewBtn}
                    >
                      View / Reply
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

function priorityStyle(priority) {
  return {
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

const filterCard = {
  padding: "22px",
  borderRadius: "26px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
  marginBottom: "24px",
  display: "grid",
  gridTemplateColumns: "1.4fr 0.8fr 0.8fr 0.8fr",
  gap: "18px",
  alignItems: "end",
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
  height: "50px",
  padding: "0 16px",
  borderRadius: "16px",
  border: "1px solid #f0ccd9",
  background: "#fff7fa",
  color: "#28141c",
  outline: "none",
  fontWeight: "800",
  boxSizing: "border-box",
};

const select = {
  ...input,
  color: "#993556",
  cursor: "pointer",
};

const filterActions = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const countText = {
  margin: 0,
  color: "#65535a",
  fontWeight: "800",
  fontSize: "14px",
};

const clearBtn = {
  height: "42px",
  border: "1px solid #f0ccd9",
  borderRadius: "999px",
  background: "#fff7fa",
  color: "#993556",
  fontWeight: "900",
  cursor: "pointer",
};

const tableCard = {
  padding: "24px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
  overflowX: "auto",
  width: "100%",
  boxSizing: "border-box",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1050px",
};

const th = {
  textAlign: "left",
  padding: "16px",
  color: "#993556",
  background: "#fff7fa",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const td = {
  padding: "16px",
  borderBottom: "1px solid #f0ccd9",
  color: "#4d2c38",
  fontWeight: "700",
  verticalAlign: "middle",
};

const viewBtn = {
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: "999px",
  background: "#d4537e",
  color: "#ffffff",
  fontWeight: "900",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const messageBox = {
  padding: "22px",
  borderRadius: "22px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#993556",
  fontWeight: "900",
};

const emptyBox = {
  padding: "22px",
  borderRadius: "22px",
  background: "#fff7fa",
  border: "1px solid #f0ccd9",
  color: "#65535a",
  fontWeight: "800",
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