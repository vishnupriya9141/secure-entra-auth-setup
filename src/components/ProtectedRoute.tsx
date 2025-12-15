import React, { type ReactNode } from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useIsAuthenticated();
  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
};

export default ProtectedRoute;