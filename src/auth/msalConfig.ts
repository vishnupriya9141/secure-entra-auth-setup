import { LogLevel, type Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID as string,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_TENANT_ID as string}`,
    // For Vite default dev server
    redirectUri: "http://localhost:5173",
    postLogoutRedirectUri: "http://localhost:5173",
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          default:
            break;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

export const tokenRequest = {
  scopes: ["openid", "profile"],
};