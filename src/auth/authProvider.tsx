import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";

const pca = new PublicClientApplication(msalConfig);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={pca}>{children}</MsalProvider>;
}