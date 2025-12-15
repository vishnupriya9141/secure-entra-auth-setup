import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../auth/msalConfig";

const Login: React.FC = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await instance.loginPopup(loginRequest);
      navigate("/dashboard");
    } catch (e: unknown) {
      console.error("Login failed", e);
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as Error).message)
          : "Login failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "4rem auto",
        padding: "2rem",
        borderRadius: "0.75rem",
        background: "#1F2937",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
        color: "#F9FAFB",
      }}
    >
      <h1 style={{ marginBottom: "0.75rem" }}>Secure Dashboard</h1>
      <p style={{ marginBottom: "1.5rem", color: "#9CA3AF" }}>
        Sign in with your Microsoft Entra ID account to access the dashboard.
      </p>

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "0.5rem",
          border: "none",
          background: loading ? "#4B5563" : "#2563EB",
          color: "#F9FAFB",
          cursor: loading ? "default" : "pointer",
          fontWeight: 600,
        }}
      >
        {loading ? "Signing in..." : "Sign in with Microsoft"}
      </button>

      {error && (
        <p style={{ marginTop: "1rem", color: "#F97316", fontSize: "0.875rem" }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#6B7280" }}>
        <p>ID Token → user profile & roles (UI security)</p>
        <p>Access Token → secure API calls</p>
      </div>
    </div>
  );
};

export default Login;