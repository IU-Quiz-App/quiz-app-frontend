export default {
    ApiURL: import.meta.env.VITE_API_URL,
    WebsocketURL: import.meta.env.VITE_WS_URL ?? "wss://ws.dev.iu-quiz.de",
    MSALClientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    MSALTenantId: import.meta.env.VITE_MSAL_TENANT_ID,
    MSALRedirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI,
};