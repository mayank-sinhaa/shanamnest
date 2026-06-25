import { useEffect, useMemo, useState } from "react";
import { authAPI } from "../../api/api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const formatServiceType = (serviceType) => {
    if (serviceType === "newborn_care") return "Newborn Care Support";
    if (serviceType === "member_portal") return "Family Member Portal";
    if (serviceType === "grievance_assistance") return "Grievance Assistance";
    return serviceType || "Not selected";
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

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await authAPI.adminMembers();
      setMembers(data);
    } catch (err) {
      setError(
        "Unable to load members. Please make sure you are logged in with admin account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    return members.filter((item) => {
      const matchesSearch =
        !search ||
        item.full_name?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.username?.toLowerCase().includes(search) ||
        item.mobile_number?.toLowerCase().includes(search) ||
        item.city?.toLowerCase().includes(search);

      const matchesService =
        serviceFilter === "all" || item.service_type === serviceFilter;

      const matchesVerification =
        verificationFilter === "all" ||
        (verificationFilter === "verified" && item.is_verified) ||
        (verificationFilter === "not_verified" && !item.is_verified);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.is_active) ||
        (statusFilter === "inactive" && !item.is_active);

      return (
        matchesSearch &&
        matchesService &&
        matchesVerification &&
        matchesStatus
      );
    });
  }, [members, searchTerm, serviceFilter, verificationFilter, statusFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setServiceFilter("all");
    setVerificationFilter("all");
    setStatusFilter("all");
  };

  return (
    <section style={page}>
      <div style={hero}>
        <p style={tag}>Manage Members</p>

        <h1 style={heading}>View registered ANAM FOUNDATION members</h1>

        <p style={subText}>
          Admin can search members, filter by service type, monitor account
          status, verification status and contact information.
        </p>
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={filterCard}>
        <div>
          <label style={label}>Search Member</label>
          <input
            style={input}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone or city"
          />
        </div>

        <div>
          <label style={label}>Service Type</label>
          <select
            style={select}
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="all">All Services</option>
            <option value="newborn_care">Newborn Care</option>
            <option value="member_portal">Member Portal</option>
            <option value="grievance_assistance">Grievance Assistance</option>
          </select>
        </div>

        <div>
          <label style={label}>Verification</label>
          <select
            style={select}
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="not_verified">Not Verified</option>
          </select>
        </div>

        <div>
          <label style={label}>Status</label>
          <select
            style={select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div style={filterActions}>
          <p style={countText}>
            Showing{" "}
            <strong style={{ color: "#993556" }}>{filteredMembers.length}</strong>{" "}
            of <strong style={{ color: "#993556" }}>{members.length}</strong>
          </p>

          <button type="button" onClick={clearFilters} style={clearBtn}>
            Clear Filters
          </button>
        </div>
      </div>

      <div style={tableCard}>
        {loading ? (
          <div style={messageBox}>Loading members...</div>
        ) : members.length === 0 ? (
          <div style={emptyBox}>No members registered yet.</div>
        ) : filteredMembers.length === 0 ? (
          <div style={emptyBox}>No members matched your filters.</div>
        ) : (
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Member</th>
                <th style={th}>Email</th>
                <th style={th}>Phone</th>
                <th style={th}>City</th>
                <th style={th}>Service Type</th>
                <th style={th}>Joined</th>
                <th style={th}>Verification</th>
                <th style={th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((item) => (
                <tr key={item.id}>
                  <td style={td}>
                    <strong>{item.full_name || "Member"}</strong>
                    <p style={{ margin: "4px 0 0", color: "#65535a" }}>
                      @{item.username}
                    </p>
                  </td>

                  <td style={td}>{item.email}</td>
                  <td style={td}>{item.mobile_number || "-"}</td>
                  <td style={td}>{item.city || "-"}</td>
                  <td style={td}>{formatServiceType(item.service_type)}</td>
                  <td style={td}>{formatDate(item.joined_date)}</td>

                  <td style={td}>
                    <span style={verificationStyle(item.is_verified)}>
                      {item.is_verified ? "Verified" : "Not Verified"}
                    </span>
                  </td>

                  <td style={td}>
                    <span style={statusStyle(item.is_active)}>
                      {item.is_active ? "Active" : "Inactive"}
                    </span>
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

function statusStyle(isActive) {
  return {
    padding: "9px 14px",
    borderRadius: "999px",
    background: isActive ? "#e8fff2" : "#fff4df",
    color: isActive ? "#1d7a46" : "#936414",
    fontWeight: "900",
    whiteSpace: "nowrap",
  };
}

function verificationStyle(isVerified) {
  return {
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
  gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 0.8fr",
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
  minWidth: "1100px",
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