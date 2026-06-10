import { useEffect, useMemo, useState } from "react";
import { supportAPI } from "../../api/api";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await supportAPI.adminContactMessages();
      setMessages(data);
    } catch (err) {
      setError(
        "Unable to load contact messages. Please login with admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return messages.filter((item) => {
      const matchesSearch =
        !search ||
        item.full_name?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.toLowerCase().includes(search) ||
        item.subject?.toLowerCase().includes(search) ||
        item.message?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      await supportAPI.updateContactMessageStatus(id, { status });

      setMessages((prevMessages) =>
        prevMessages.map((item) =>
          item.id === id ? { ...item, status: status } : item
        )
      );

      setSuccess("Contact message status updated successfully.");
    } catch (err) {
      setError("Unable to update status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section style={page}>
      <div style={hero}>
        <p style={tag}>Contact Messages</p>

        <h1 style={heading}>Public contact form messages</h1>

        <p style={subText}>
          Search public contact messages, filter by status, and update their
          support progress from one place.
        </p>
      </div>

      {error && <div style={errorBox}>{error}</div>}
      {success && <div style={successBox}>✓ {success}</div>}

      <div style={filterCard}>
        <div>
          <label style={label}>Search Message</label>
          <input
            style={input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, subject or message"
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
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <div style={filterActions}>
          <p style={countText}>
            Showing{" "}
            <strong style={{ color: "#993556" }}>
              {filteredMessages.length}
            </strong>{" "}
            of <strong style={{ color: "#993556" }}>{messages.length}</strong>
          </p>

          <button type="button" onClick={clearFilters} style={clearBtn}>
            Clear Filters
          </button>
        </div>
      </div>

      <div style={tableCard}>
        {loading ? (
          <div style={messageBox}>Loading contact messages...</div>
        ) : messages.length === 0 ? (
          <div style={emptyBox}>No contact messages found.</div>
        ) : filteredMessages.length === 0 ? (
          <div style={emptyBox}>No contact messages matched your filters.</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>Subject</th>
                <th style={th}>Message</th>
                <th style={th}>Status</th>
                <th style={th}>Update Status</th>
                <th style={th}>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredMessages.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.full_name}</td>
                  <td style={td}>{item.email}</td>
                  <td style={td}>{item.phone || "-"}</td>
                  <td style={td}>{item.subject}</td>

                  <td style={{ ...td, maxWidth: "360px", lineHeight: "1.6" }}>
                    {item.message}
                  </td>

                  <td style={td}>
                    <span style={statusStyle(item.status)}>{item.status}</span>
                  </td>

                  <td style={td}>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value)
                      }
                      disabled={updatingId === item.id}
                      style={selectStyle}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>

                    {updatingId === item.id && (
                      <p style={updatingText}>Updating...</p>
                    )}
                  </td>

                  <td style={td}>{formatDate(item.created_at)}</td>
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
    background:
      status === "new"
        ? "#fff4df"
        : status === "replied"
        ? "#e8fff2"
        : "#fbeaf0",
    color:
      status === "new"
        ? "#936414"
        : status === "replied"
        ? "#1d7a46"
        : "#993556",
    fontWeight: "900",
    textTransform: "capitalize",
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
  gridTemplateColumns: "1.5fr 0.8fr 0.7fr",
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
  minWidth: "1300px",
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
  verticalAlign: "top",
};

const selectStyle = {
  width: "150px",
  height: "44px",
  borderRadius: "14px",
  border: "1px solid #f0ccd9",
  background: "#fff7fa",
  color: "#993556",
  fontWeight: "900",
  padding: "0 12px",
  outline: "none",
  cursor: "pointer",
};

const updatingText = {
  margin: "8px 0 0",
  color: "#65535a",
  fontSize: "13px",
  fontWeight: "800",
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