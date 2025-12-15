import React, { type ReactNode } from "react";
import { useMsal } from "@azure/msal-react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

/**
 * RoleGuard
 * Shows children only if the signed-in user has at least one of the allowed roles.
 * Roles are read from the `roles` claim in the ID token (App Roles in Entra ID).
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { accounts } = useMsal();
  const roles: string[] = (accounts[0]?.idTokenClaims?.roles as string[]) || [];

  const isAllowed = Array.isArray(allowedRoles)
    ? allowedRoles.some((r) => roles.includes(r))
    : roles.includes(allowedRoles as unknown as string);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;