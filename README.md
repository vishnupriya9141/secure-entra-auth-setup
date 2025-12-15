# Secure Dashboard – React + TypeScript + Vite with Azure AD (Entra ID) Auth

This project is a secure dashboard application built with React, TypeScript, and Vite. It integrates Microsoft Entra ID (Azure AD) using MSAL for authentication, protected routing, and basic role-based access control.

The app is structured around an authentication provider, protected routes, and a small set of example pages (Dashboard, Profile, Settings) to demonstrate how to secure a SPA with Azure AD.

---

## Tech Stack

- React 18 + TypeScript
- Vite
- MSAL.js (Microsoft Authentication Library) for Azure AD / Entra ID
- React Router (protected routes, role guards)

---

## Features

- Azure AD / Entra ID sign-in via MSAL
- Global auth context via [`AuthProvider`](src/auth/authProvider.tsx:1)
- Central MSAL configuration in [`msalConfig`](src/auth/msalConfig.ts:1)
- Route protection using [`ProtectedRoute`](src/components/ProtectedRoute.tsx:1)
- Role-based access control using [`RoleGuard`](src/components/RoleGuard.tsx:1)
- Example pages:
  - Login – [`Login`](src/pages/Login.tsx:1)

---

## Project Structure (high level)

- [`src/main.tsx`](src/main.tsx:1) – React entry point; wires up routing and the auth provider.
- [`src/App.tsx`](src/App.tsx:1) – Top-level app shell and route definitions.
- [`src/auth/authProvider.tsx`](src/auth/authProvider.tsx:1) – Wraps the app with MSAL and exposes auth context/hooks.
- [`src/auth/msalConfig.ts`](src/auth/msalConfig.ts:1) – MSAL configuration (client ID, authority, redirect URIs, scopes).
- [`src/components/ProtectedRoute.tsx`](src/components/ProtectedRoute.tsx:1) – Protects routes and redirects unauthenticated users.
- [`src/components/RoleGuard.tsx`](src/components/RoleGuard.tsx:1) – Conditionally renders content based on user roles/claims.
- [`src/pages/`](src/pages/Dashboard.tsx:1) – Example feature pages (Dashboard, Login, Profile, Settings).

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- An Azure AD / Microsoft Entra ID app registration with SPA redirect URLs configured.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (if not already present) and configure your Azure AD / Entra ID application values, for example:

```bash
VITE_AZURE_AD_CLIENT_ID=<your_client_id>
VITE_AZURE_AD_TENANT_ID=<your_tenant_id_or_common>
VITE_AZURE_AD_REDIRECT_URI=http://localhost:5173
```

These variables are typically consumed inside [`msalConfig`](src/auth/msalConfig.ts:1) to construct the MSAL configuration.

> Do not commit secrets to source control. Use `.env` locally and appropriate secret stores in higher environments.

### 3. Run the app in development mode

```bash
npm run dev
```

Vite will print a local URL (by default `http://localhost:5173`). Open it in your browser and sign in with an account from your Azure AD / Entra tenant.

### 4. Build for production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Authentication Flow (Overview)

1. The app boots in [`src/main.tsx`](src/main.tsx:1), which wraps the router with [`AuthProvider`](src/auth/authProvider.tsx:1).
2. [`AuthProvider`](src/auth/authProvider.tsx:1) initializes MSAL using [`msalConfig`](src/auth/msalConfig.ts:1) and exposes authentication state and actions (login, logout, account info).
3. Routes that require authentication are wrapped with [`ProtectedRoute`](src/components/ProtectedRoute.tsx:1), which either renders the requested page or redirects to the login page.
4. For routes or components that require specific roles/permissions, [`RoleGuard`](src/components/RoleGuard.tsx:1) checks the user's claims (e.g., roles) before rendering.

---

## Scripts

- `npm run dev` – Start Vite dev server.
- `npm run build` – Build for production.
- `npm run preview` – Preview the production build locally.
- `npm run lint` – Run lint checks (if configured in [`eslint.config.js`](eslint.config.js:1)).

---

## Notes

- This project was bootstrapped with Vite's React + TypeScript template and then extended with an MSAL-based authentication layer.
- You can customize routes and pages under [`src/pages`](src/pages/Dashboard.tsx:1) and extend role-based access logic inside [`RoleGuard`](src/components/RoleGuard.tsx:1).
