import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import MemberRoutes from "./MemberRoutes";
import AdminRoutes from "./AdminRoutes";
import { authAPI } from "../api/api";

function LoadingScreen({ text }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial",
        background: "#fff7fa",
        color: "#993556",
        fontWeight: "900",
        fontSize: "20px",
      }}
    >
      {text}
    </div>
  );
}

function MemberProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");

  useEffect(() => {
    const checkMember = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setRedirectTo("/login");
        setChecking(false);
        return;
      }

      try {
        const user = await authAPI.currentUser();

        if (user.is_staff || user.is_superuser) {
          setRedirectTo("/admin/dashboard");
        } else {
          setAllowed(true);
        }
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setRedirectTo("/login");
      } finally {
        setChecking(false);
      }
    };

    checkMember();
  }, []);

  if (checking) {
    return <LoadingScreen text="Checking member access..." />;
  }

  if (!allowed) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [redirectTo, setRedirectTo] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setRedirectTo("/login");
        setChecking(false);
        return;
      }

      try {
        const user = await authAPI.currentUser();

        if (user.is_staff || user.is_superuser) {
          setAllowed(true);
        } else {
          setRedirectTo("/member/dashboard");
        }
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setRedirectTo("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, []);

  if (checking) {
    return <LoadingScreen text="Checking admin access..." />;
  }

  if (!allowed) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/member/*"
        element={
          <MemberProtectedRoute>
            <MemberRoutes />
          </MemberProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminRoutes />
          </AdminProtectedRoute>
        }
      />

      <Route path="/*" element={<PublicRoutes />} />
    </Routes>
  );
}