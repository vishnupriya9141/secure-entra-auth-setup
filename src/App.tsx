import React, { useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import "./App.css";
import Login from "./pages/Login";
import RoleGuard from "./components/RoleGuard";
import { tokenRequest } from "./auth/msalConfig";

const TopNav: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.75rem 1.5rem",
        background: "#111827",
        color: "#F9FAFB",
      }}
    >
      <div>
        <span
          style={{
            color: "#F9FAFB",
            marginRight: "1rem",
            fontWeight: 600,
          }}
        >
          Secure Dashboard
        </span>
        {isAuthenticated && (
          <span style={{ color: "#9CA3AF", fontSize: "0.9rem" }}>
            One-Page View: Overview · Users · Settings · Activity
          </span>
        )}
      </div>
      <div>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            style={{
              background: "#DC2626",
              border: "none",
              color: "#F9FAFB",
              padding: "0.35rem 0.75rem",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const OnePageDashboard: React.FC = () => {
  const { accounts, instance } = useMsal();
  const account = accounts[0];
  const claims = (account?.idTokenClaims ?? {}) as Record<string, unknown>;
  const name =
    (claims.name as string) ||
    account?.name ||
    account?.username ||
    "N/A";
  const email =
    (claims.preferred_username as string) ||
    (claims.email as string) ||
    account?.username ||
    "N/A";
  const tenantId =
    (claims.tid as string) ||
    (claims.tenantId as string) ||
    "N/A";
  const roles = (claims.roles as string[]) || [];

  const [apiResult, setApiResult] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const callProtectedApi = async () => {
    if (!account) {
      setApiError("No signed-in account.");
      return;
    }
    setApiResult(null);
    setApiError(null);
    setApiLoading(true);

    try {
      const response = await instance.acquireTokenSilent({
        ...tokenRequest,
        account,
      });

      const accessToken = response.accessToken;
      const apiUrl = "https://your-api-url.example.com/secure-endpoint"; // placeholder

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
      setApiError(message);
    } finally {
      setApiLoading(false);
    }
  };

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Overview */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.25rem" }}>Overview</h2>
        <p style={{ marginBottom: "1rem", color: "#9CA3AF" }}>
          High-level information about the signed-in user and tenant.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#1F2937",
              borderRadius: "0.5rem",
              padding: "1rem",
              border: "1px solid #374151",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>User</h3>
            <p>
              <strong>Name:</strong> {name}
            </p>
            <p>
              <strong>Email:</strong> {email}
            </p>
          </div>
          <div
            style={{
              background: "#1F2937",
              borderRadius: "0.5rem",
              padding: "1rem",
              border: "1px solid #374151",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>Tenant</h3>
            <p>
              <strong>Tenant ID:</strong> {tenantId}
            </p>
            <p>
              <strong>Object ID:</strong> {(claims.oid as string) || "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* Users */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.25rem" }}>Users</h2>
        <p style={{ marginBottom: "1rem", color: "#9CA3AF" }}>
          Role-based view of what this account can access inside the application.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#1F2937",
              borderRadius: "0.5rem",
              padding: "1rem",
              border: "1px solid #374151",
            }}
          >
            <h3 style={{ marginBottom: "0.5rem" }}>Assigned Roles</h3>
            {roles.length === 0 ? (
              <p style={{ color: "#9CA3AF" }}>No app roles assigned.</p>
            ) : (
              <ul>
                {roles.map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            )}
          </div>

          <RoleGuard allowedRoles={["Admin"]}>
            <div
              style={{
                background: "#1F2937",
                borderRadius: "0.5rem",
                padding: "1rem",
                border: "1px solid #374151",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Admin Actions</h3>
              <p style={{ fontSize: "0.9rem", color: "#D1D5DB" }}>
                Manage users, review audit logs, and configure security policies.
              </p>
            </div>
          </RoleGuard>

          <RoleGuard allowedRoles={["Editor", "Admin"]}>
            <div
              style={{
                background: "#1F2937",
                borderRadius: "0.5rem",
                padding: "1rem",
                border: "1px solid #374151",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Editors</h3>
              <p style={{ fontSize: "0.9rem", color: "#D1D5DB" }}>
                Create and update dashboard content and configuration.
              </p>
            </div>
          </RoleGuard>
        </div>
      </section>

      {/* Settings */}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ marginBottom: "0.25rem" }}>Settings</h2>
        <p style={{ marginBottom: "1rem", color: "#9CA3AF" }}>
          Demonstrates using an Access Token to call a protected backend API using{" "}
          <code>acquireTokenSilent</code>.
        </p>

        <button
          onClick={callProtectedApi}
          disabled={apiLoading}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            background: apiLoading ? "#4B5563" : "#10B981",
            color: "#0F172A",
            fontWeight: 600,
            cursor: apiLoading ? "default" : "pointer",
            marginBottom: "1rem",
          }}
        >
          {apiLoading ? "Calling API..." : "Call protected API"}
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

        {apiError && (
          <p style={{ color: "#F97316", fontSize: "0.875rem" }}>{apiError}</p>
        )}
      </section>

      {/* Activity */}
      <section>
        <h2 style={{ marginBottom: "0.25rem" }}>Activity</h2>
        <p style={{ marginBottom: "1rem", color: "#9CA3AF" }}>
          High-level view of sign-in and token details for this session.
        </p>
        <div
          style={{
            background: "#1F2937",
            borderRadius: "0.5rem",
            padding: "1rem",
            border: "1px solid #374151",
          }}
        >
          <p>
            <strong>Session started (iat):</strong>{" "}
            {(claims.iat as number) ? new Date((claims.iat as number) * 1000).toISOString() : "N/A"}
          </p>
          <p>
            <strong>Token expires (exp):</strong>{" "}
            {(claims.exp as number) ? new Date((claims.exp as number) * 1000).toISOString() : "N/A"}
          </p>
          <p>
            <strong>Issuer (iss):</strong> {(claims.iss as string) || "N/A"}
          </p>
        </div>
      </section>
    </div>
  );
};

const App: React.FC = () => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#F9FAFB",
      }}
    >
      <TopNav />
      <main>
        {isAuthenticated ? <OnePageDashboard /> : <Login />}
      </main>
    </div>
  );
};

export default App;