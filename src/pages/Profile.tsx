import React from "react";
import { useMsal } from "@azure/msal-react";

/**
 * Profile
 * Shows:
 * - Name
 * - Email
 * - Tenant ID
 * - Assigned roles (from `roles` claim)
 */
const Profile: React.FC = () => {
  const { accounts } = useMsal();
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

  return (
    <div>
      <h2 style={{ marginBottom: "0.5rem" }}>Profile</h2>
      <p style={{ marginBottom: "1rem", color: "#9CA3AF" }}>
        Information from your ID token (Microsoft Entra ID).
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
          <h3 style={{ marginBottom: "0.5rem" }}>Basic Info</h3>
          <p>
            <strong>Name:</strong> {name}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Tenant ID:</strong> {tenantId}
          </p>
          <p>
            <strong>Object ID:</strong> {(claims.oid as string) || "N/A"}
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
      </div>

      <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#6B7280" }}>
        <p>
          Roles come from <code>appRoles</code> in your app registration and appear in the{" "}
          <code>roles</code> claim of the ID token.
        </p>
      </div>
    </div>
  );
};

export default Profile;