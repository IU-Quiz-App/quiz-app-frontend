import {LogLevel, PublicClientApplication} from '@azure/msal-browser';
import Config from "@services/Config.ts";

export const msalConfig = {
    auth: {
        clientId: Config.MSALClientId,
        authority: `https://login.microsoftonline.com/${Config.MSALTenantId}/`,
        redirectUri: Config.MSALRedirectUri,
        postLogoutRedirectUri: '/',
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
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

export const msalInstance = new PublicClientApplication(msalConfig);

await msalInstance.initialize();