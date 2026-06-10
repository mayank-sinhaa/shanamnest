import { Link } from "react-router-dom";

export default function About() {
  const values = [
    {
      title: "Care First",
      text: "We focus on warm, reliable and family-friendly newborn support.",
    },
    {
      title: "Secure Access",
      text: "Members can access dashboard, profile and grievance services safely.",
    },
    {
      title: "Fast Support",
      text: "Grievances are tracked clearly from submission to resolution.",
    },
  ];

  const steps = [
    "Register as a ShanamNest member",
    "Access your personal dashboard",
    "Submit grievances or support requests",
    "Track replies and status updates",
  ];

  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
        fontFamily: "Arial",
        background:
          "radial-gradient(circle at top left, #fbeaf0 0, transparent 32%), linear-gradient(135deg, #fff7fa 0%, #ffffff 55%, #fbeaf0 100%)",
      }}
    >
      <section
        style={{
          padding: "95px 8% 60px",
          display: "grid",
          gridTemplateColumns: "1.05fr 0.95fr",
          gap: "54px",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              width: "fit-content",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "#fbeaf0",
              color: "#993556",
              fontWeight: "900",
              marginBottom: "20px",
            }}
          >
            About ShanamNest
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(44px, 6vw, 76px)",
              lineHeight: "1.05",
              letterSpacing: "-2px",
              color: "#28141c",
            }}
          >
            A caring digital platform for{" "}
            <span style={{ color: "#d4537e" }}>newborn families</span>
          </h1>

          <p
            style={{
              margin: "26px 0 34px",
              color: "#65535a",
              lineHeight: "1.8",
              fontSize: "18px",
              maxWidth: "720px",
            }}
          >
            ShanamNest is designed to support families through member services,
            grievance tracking, profile management and structured communication
            with the support team.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link
              to="/register"
              style={{
                padding: "15px 24px",
                borderRadius: "999px",
                background: "#d4537e",
                color: "#ffffff",
                textDecoration: "none",
                fontWeight: "900",
                boxShadow: "0 14px 34px rgba(212, 83, 126, 0.32)",
              }}
            >
              Become a Member
            </Link>

            <Link
              to="/services"
              style={{
                padding: "15px 24px",
                borderRadius: "999px",
                background: "#ffffff",
                color: "#993556",
                textDecoration: "none",
                fontWeight: "900",
                border: "1px solid #f0ccd9",
              }}
            >
              Explore Services
            </Link>
          </div>
        </div>

        <div
          style={{
            padding: "34px",
            borderRadius: "38px",
            background: "#ffffff",
            border: "1px solid #f0ccd9",
            boxShadow: "0 28px 80px rgba(153, 53, 86, 0.16)",
          }}
        >
          <div
            style={{
              height: "260px",
              borderRadius: "30px",
              background:
                "linear-gradient(135deg, #993556, #d4537e), radial-gradient(circle at top right, #fbeaf0, transparent)",
              display: "grid",
              placeItems: "center",
              color: "#ffffff",
              textAlign: "center",
              padding: "28px",
              marginBottom: "26px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 12px", fontSize: "42px" }}>
                ShanamNest
              </h2>
              <p style={{ margin: 0, lineHeight: "1.7", color: "#ffe6ef" }}>
                Newborn care support, grievance management and member services
                in one trusted platform.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "14px",
            }}
          >
            <MiniStat value="24/7" label="Access" />
            <MiniStat value="100%" label="Secure" />
            <MiniStat value="Fast" label="Support" />
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "30px 8% 70px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        }}
      >
        {values.map((item, index) => (
          <article
            key={item.title}
            style={{
              padding: "30px",
              borderRadius: "30px",
              background: "#ffffff",
              border: "1px solid #f0ccd9",
              boxShadow: "0 18px 55px rgba(153, 53, 86, 0.1)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                display: "grid",
                placeItems: "center",
                borderRadius: "20px",
                background: "#fbeaf0",
                color: "#993556",
                fontWeight: "900",
                fontSize: "20px",
                marginBottom: "22px",
              }}
            >
              {index + 1}
            </div>

            <h3 style={{ margin: "0 0 12px", color: "#993556" }}>
              {item.title}
            </h3>

            <p style={{ margin: 0, color: "#65535a", lineHeight: "1.8" }}>
              {item.text}
            </p>
          </article>
        ))}
      </section>

      <section
        style={{
          padding: "20px 8% 100px",
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: "34px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            padding: "34px",
            borderRadius: "34px",
            background: "linear-gradient(135deg, #28141c, #993556)",
            color: "#ffffff",
            boxShadow: "0 24px 70px rgba(40, 20, 28, 0.22)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              color: "#ffd8e6",
              fontWeight: "900",
            }}
          >
            Our Mission
          </p>

          <h2 style={{ margin: 0, fontSize: "42px", lineHeight: "1.1" }}>
            Making family support simple, secure and trackable
          </h2>

          <p style={{ color: "#ffe6ef", lineHeight: "1.8", marginTop: "18px" }}>
            Our goal is to provide a clean digital experience where families can
            access support, submit concerns and receive timely updates.
          </p>
        </div>

        <div
          style={{
            padding: "34px",
            borderRadius: "34px",
            background: "#ffffff",
            border: "1px solid #f0ccd9",
            boxShadow: "0 18px 55px rgba(153, 53, 86, 0.1)",
          }}
        >
          <h2 style={{ margin: "0 0 22px", color: "#28141c" }}>
            How ShanamNest Works
          </h2>

          {steps.map((step, index) => (
            <div
              key={step}
              style={{
                display: "grid",
                gridTemplateColumns: "48px 1fr",
                gap: "16px",
                alignItems: "center",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "18px",
                  background: "#fbeaf0",
                  color: "#993556",
                  display: "grid",
                  placeItems: "center",
                  fontWeight: "900",
                }}
              >
                {index + 1}
              </div>

              <p
                style={{
                  margin: 0,
                  color: "#4d2c38",
                  fontWeight: "800",
                  lineHeight: "1.6",
                }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function MiniStat({ value, label }) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "22px",
        background: "#fff7fa",
        border: "1px solid #f0ccd9",
        textAlign: "center",
      }}
    >
      <h3 style={{ margin: 0, color: "#993556", fontSize: "26px" }}>
        {value}
      </h3>
      <p style={{ margin: "6px 0 0", color: "#65535a", fontWeight: "800" }}>
        {label}
      </p>
    </div>
  );
}