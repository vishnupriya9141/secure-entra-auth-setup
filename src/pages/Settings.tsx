import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { tokenRequest } from "../auth/msalConfig";

/**
 * Settings
 * Demonstrates silent token acquisition (refresh) via acquireTokenSilent
 * and using the Access Token to call a protected backend API.
 */
const Settings: React.FC = () => {
  const { instance, accounts } = useMsal();
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callProtectedApi = async () => {
    if (!accounts[0]) {
      setError("No signed-in account.");
      return;
    }

    setApiResult(null);
    setError(null);
    setLoading(true);

    try {
      // Silent token acquisition (no user interaction, handles refresh)
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        account: accounts[0],
      });

      const accessToken = response.accessToken;

      // TODO: replace with your real API URL
      const apiUrl = "https://your-api-url.example.com/secure-endpoint";

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();
      setApiResult(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      console.error("Protected API call failed", e);
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as Error).message)
          : "API call failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "0.5rem" }}>Settings</h2>
      <p style={{ marginBottom: "1rem", color: "#9CA3AF" }}>
        Example of using an Access Token from Microsoft Entra ID to call a protected backend API.
      </p>

      <button
        onClick={callProtectedApi}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          border: "none",
          background: loading ? "#4B5563" : "#10B981",
          color: "#0F172A",
          fontWeight: 600,
          cursor: loading ? "default" : "pointer",
          marginBottom: "1rem",
        }}
      >
        {loading ? "Calling API..." : "Call protected API"}
      </button>

      {apiResult && (
        <pre
          style={{
            background: "#020617",
            padding: "1rem",
            borderRadius: "0.5rem",
            border: "1px solid #1E293B",
            fontSize: "0.8rem",
            color: "#E5E7EB",
            overflowX: "auto",
          }}
        >
          {apiResult}
        </pre>
      )}

      {error && (
        <p style={{ color: "#F97316", fontSize: "0.875rem" }}>
          {error}
        </p>
      )}

      <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#6B7280" }}>
        <p>
          Token refresh is handled via <code>acquireTokenSilent</code> using your cached session,
          so users are not prompted again while their session is valid.
        </p>
      </div>
    </div>
  );
};

export default Settings;