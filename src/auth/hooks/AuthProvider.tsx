import { AuthenticationResult, EventType } from "@azure/msal-browser";
import { msalInstance } from "../AuthConfig.ts";
import { MsalProvider } from "@azure/msal-react";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    msalInstance.addEventCallback((event) => {
        const authenticationResult = event.payload as AuthenticationResult;
        const account = authenticationResult?.account;
        if (event.eventType === EventType.LOGIN_SUCCESS && account) {
            msalInstance.setActiveAccount(account);
        }
    });

    return (
            <MsalProvider instance={msalInstance}>{children}</MsalProvider>
    );
};

export function useAuthProvider() {
    return { AuthProvider }
}