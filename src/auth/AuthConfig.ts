import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
    auth: {
        clientId: '95c03aad-1f24-43f8-b571-c4b8a8ae44d2',
        authority: 'https://login.microsoftonline.com/c630d2a3-948c-402d-93ca-0060609c152e/',
        redirectUri: 'http://localhost:5173/',
        postLogoutRedirectUri: '/',
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level: any, message: any, containsPii: any) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

export const loginRequest = {
    scopes: [],
};