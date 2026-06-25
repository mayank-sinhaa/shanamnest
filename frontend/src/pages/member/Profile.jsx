import { useEffect, useState } from "react";
import { apiRequest, authAPI } from "../../api/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    mobile_number: "",
    city: "",
    service_type: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const formatServiceType = (serviceType) => {
    if (serviceType === "newborn_care") return "Newborn Care Support";
    if (serviceType === "member_portal") return "Family Member Portal";
    if (serviceType === "grievance_assistance") return "Grievance Assistance";
    return "Not selected";
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

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await authAPI.profile();

      setProfile(data);

      setFormData({
        mobile_number: data.mobile_number || "",
        city: data.city || "",
        service_type: data.service_type || "",
        address: data.address || "",
      });
    } catch (err) {
      setError("Unable to load profile. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setError("");
    setSuccess("");

    const { name, value } = e.target;

    if (name === "mobile_number") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);

      setFormData({
        ...formData,
        mobile_number: onlyNumbers,
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");

    if (!formData.mobile_number.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      setError("Please enter a valid 10 digit Indian mobile number.");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter your city or area.");
      return;
    }

    if (!formData.service_type) {
      setError("Please select a service type.");
      return;
    }

    try {
      setSaving(true);

      const updatedProfile = await apiRequest("/accounts/profile/", {
        method: "PATCH",
        body: JSON.stringify({
          mobile_number: formData.mobile_number.trim(),
          city: formData.city.trim(),
          service_type: formData.service_type,
          address: formData.address.trim(),
        }),
      });

      setProfile(updatedProfile);

      setFormData({
        mobile_number: updatedProfile.mobile_number || "",
        city: updatedProfile.city || "",
        service_type: updatedProfile.service_type || "",
        address: updatedProfile.address || "",
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section style={page}>
        <div style={messageBox}>Loading profile...</div>
      </section>
    );
  }

  return (
    <section style={page}>
      <div style={hero}>
        <div>
          <p style={tag}>My Profile</p>

          <h1 style={heading}>Manage your member information</h1>

          <p style={subText}>
            Keep your personal details updated for better communication,
            grievance tracking and ANAM FOUNDATION support.
          </p>
        </div>

        <button type="button" onClick={loadProfile} style={reloadBtn}>
          Reload Profile
        </button>
      </div>

      {error && <div style={errorBox}>{error}</div>}
      {success && <div style={successBox}>✓ {success}</div>}

      <div style={mainGrid}>
        <div style={summaryCard}>
          <div style={profileHeader}>
            <div style={avatar}>
              {profile?.full_name
                ? profile.full_name.charAt(0).toUpperCase()
                : "M"}
            </div>

            <div>
              <h2 style={name}>{profile?.full_name || "Member User"}</h2>

              <p style={email}>{profile?.email || "member@shanamnest.org"}</p>

              <div style={{ marginTop: "12px" }}>
                <span style={verificationStyle(profile?.is_verified)}>
                  {profile?.is_verified ? "Verified Member" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>

          <div style={infoBox}>
            <p style={infoLabel}>Username</p>
            <strong style={infoValue}>@{profile?.username || "-"}</strong>
          </div>

          <div style={infoBox}>
            <p style={infoLabel}>Mobile Number</p>
            <strong style={infoValue}>{profile?.mobile_number || "-"}</strong>
          </div>

          <div style={infoBox}>
            <p style={infoLabel}>City / Area</p>
            <strong style={infoValue}>{profile?.city || "-"}</strong>
          </div>

          <div style={infoBox}>
            <p style={infoLabel}>Service Type</p>
            <strong style={infoValue}>
              {formatServiceType(profile?.service_type)}
            </strong>
          </div>

          <div style={infoBox}>
            <p style={infoLabel}>Joined Date</p>
            <strong style={infoValue}>{formatDate(profile?.created_at)}</strong>
          </div>
        </div>

        <div style={card}>
          <h2 style={{ margin: "0 0 8px", color: "#28141c" }}>
            Edit Profile
          </h2>

          <p style={{ margin: "0 0 26px", color: "#65535a", lineHeight: "1.7" }}>
            Full name and email are locked for account safety. You can update
            phone, city, service type and address.
          </p>

          <form>
            <div style={formGrid}>
              <div>
                <label style={label}>Full Name</label>
                <input
                  style={disabledInput}
                  type="text"
                  value={profile?.full_name || ""}
                  disabled
                />
              </div>

              <div>
                <label style={label}>Email Address</label>
                <input
                  style={disabledInput}
                  type="email"
                  value={profile?.email || ""}
                  disabled
                />
              </div>
            </div>

            <div style={formGrid}>
              <div>
                <label style={label}>Mobile Number</label>
                <input
                  style={input}
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="Enter 10 digit mobile number"
                  inputMode="numeric"
                  maxLength="10"
                />
              </div>

              <div>
                <label style={label}>City / Area</label>
                <input
                  style={input}
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city or area"
                />
              </div>
            </div>

            <label style={label}>Service Type</label>
            <select
              style={input}
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
            >
              <option value="">Select service type</option>
              <option value="newborn_care">Newborn Care Support</option>
              <option value="member_portal">Family Member Portal</option>
              <option value="grievance_assistance">Grievance Assistance</option>
            </select>

            <label style={label}>Address</label>
            <textarea
              style={textarea}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter full address"
            ></textarea>

            <button
              type="button"
              style={{
                ...button,
                opacity: saving ? 0.75 : 1,
                cursor: saving ? "not-allowed" : "pointer",
              }}
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving ? "Updating Profile..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
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
};

const subText = {
  maxWidth: "760px",
  margin: "18px 0 0",
  color: "#ffe6ef",
  lineHeight: "1.8",
};

const reloadBtn = {
  padding: "14px 18px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.45)",
  background: "#ffffff",
  color: "#993556",
  fontWeight: "900",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "0.8fr 1.2fr",
  gap: "24px",
  alignItems: "start",
};

const summaryCard = {
  width: "100%",
  padding: "30px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
  boxSizing: "border-box",
};

const card = {
  width: "100%",
  padding: "34px",
  borderRadius: "30px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  boxShadow: "0 16px 45px rgba(153, 53, 86, 0.1)",
  boxSizing: "border-box",
};

const profileHeader = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
  marginBottom: "26px",
};

const avatar = {
  width: "90px",
  height: "90px",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  background: "#fbeaf0",
  color: "#993556",
  fontSize: "38px",
  fontWeight: "900",
  flexShrink: 0,
};

const name = {
  margin: "0 0 6px",
  color: "#28141c",
};

const email = {
  margin: 0,
  color: "#65535a",
};

const infoBox = {
  padding: "16px 0",
  borderBottom: "1px solid #f0ccd9",
};

const infoLabel = {
  margin: "0 0 6px",
  color: "#65535a",
  fontWeight: "800",
  fontSize: "14px",
};

const infoValue = {
  color: "#28141c",
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

const disabledInput = {
  ...input,
  background: "#f6edf1",
  color: "#65535a",
  cursor: "not-allowed",
};

const textarea = {
  ...input,
  height: "120px",
  padding: "14px 16px",
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
};

const messageBox = {
  width: "100%",
  padding: "22px",
  borderRadius: "22px",
  background: "#ffffff",
  border: "1px solid #f0ccd9",
  color: "#993556",
  fontWeight: "900",
  boxSizing: "border-box",
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

const successBox = {
  width: "100%",
  padding: "16px 18px",
  marginBottom: "20px",
  borderRadius: "18px",
  background: "#e8fff2",
  border: "1px solid #b6edca",
  color: "#1d7a46",
  fontWeight: "800",
  lineHeight: "1.6",
  boxSizing: "border-box",
};