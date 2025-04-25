import { AuthenticationResult, EventType } from "@azure/msal-browser";
import { msalInstance } from "../AuthConfig.ts";
import { MsalProvider } from "@azure/msal-react";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    msalInstance.enableAccountStorageEvents();

    msalInstance.addEventCallback((event) => {
        var authenticationResult = event?.payload as AuthenticationResult;
        if (event.eventType === EventType.LOGIN_SUCCESS && authenticationResult?.account) {
            const account = authenticationResult?.account;
            msalInstance.setActiveAccount(account);
            window.location.reload();
        }
    });

    return (
            <MsalProvider instance={msalInstance}>{children}</MsalProvider>
    );
};

export function useAuthProvider() {
    return { AuthProvider }
}