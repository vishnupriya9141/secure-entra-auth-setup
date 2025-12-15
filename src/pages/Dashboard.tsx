import React from "react";
import { useMsal } from "@azure/msal-react";
import RoleGuard from "../components/RoleGuard";

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.5rem",
        background: "#1F2937",
        border: "1px solid #374151",
        minHeight: "120px",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>{title}</h3>
      <div style={{ fontSize: "0.875rem", color: "#D1D5DB" }}>{children}</div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { accounts } = useMsal();
  const account = accounts[0];
  const name = account?.name ?? "User";

  return (
    <div>
      <h2 style={{ marginBottom: "0.25rem" }}>Welcome, {name}</h2>
      <p style={{ marginBottom: "1.5rem", color: "#9CA3AF" }}>
        This dashboard is protected by Microsoft Entra ID and app roles.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Visible to any authenticated user */}
        <Card title="My Activity">
          Recent login events, notifications, or KPIs for the current user.
        </Card>

        {/* Admin-only card */}
        <RoleGuard allowedRoles={["Admin"]}>
          <Card title="Admin Control Panel (Admin only)">
            - Manage users and roles
            <br />
            - Review audit logs
            <br />
            - Configure security settings
          </Card>
        </RoleGuard>

        {/* Editor + Admin */}
        <RoleGuard allowedRoles={["Admin", "Editor"]}>
          <Card title="Content Management (Admin / Editor)">
            Create, edit, and publish content or configurations.
          </Card>
        </RoleGuard>

        {/* Reader role */}
        <RoleGuard allowedRoles={["Reader", "User", "Admin"]}>
          <Card title="Reporting (Reader+ roles)">
            Read-only access to analytics and reports.
          </Card>
        </RoleGuard>
      </div>
    </div>
  );
};

export default Dashboard;