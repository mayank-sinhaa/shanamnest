import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 76px)",
        fontFamily: "Arial",
        background:
          "radial-gradient(circle at top left, #fbeaf0 0, transparent 34%), linear-gradient(135deg, #fff7fa 0%, #ffffff 55%, #fbeaf0 100%)",
        display: "grid",
        placeItems: "center",
        padding: "60px 8%",
        textAlign: "center",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "780px",
          padding: "54px",
          borderRadius: "38px",
          background: "#ffffff",
          border: "1px solid #f0ccd9",
          boxShadow: "0 28px 80px rgba(153, 53, 86, 0.18)",
        }}
      >
        <p
          style={{
            width: "fit-content",
            margin: "0 auto 18px",
            padding: "10px 18px",
            borderRadius: "999px",
            background: "#fbeaf0",
            color: "#993556",
            fontWeight: "900",
          }}
        >
          404 Error
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(52px, 8vw, 96px)",
            lineHeight: "1",
            color: "#d4537e",
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            maxWidth: "620px",
            margin: "22px auto 34px",
            color: "#65535a",
            lineHeight: "1.8",
            fontSize: "18px",
          }}
        >
          The page you are looking for does not exist or may have been moved.
          Please return to ANAM FOUNDATION home page.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
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
            Go Home
          </Link>

          <Link
            to="/contact"
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
            Contact Support
          </Link>
        </div>
      </section>
    </main>
  );
}