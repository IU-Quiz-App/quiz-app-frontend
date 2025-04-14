import {Context, createContext, useState} from "react";
import { AuthenticationResult, EventType, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../AuthConfig.ts";
import { MsalProvider } from "@azure/msal-react";
import { getUser } from "@services/Api.ts";
import { User } from "@services/Types.ts";

interface AuthContextType {
    user: User|undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
) as Context<AuthContextType>;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const msalInstance = new PublicClientApplication(msalConfig);

    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
    }

    msalInstance.addEventCallback((event) => {
        const authenticationResult = event.payload as AuthenticationResult;
        const account = authenticationResult?.account;
        if (event.eventType === EventType.LOGIN_SUCCESS && account) {
            msalInstance.setActiveAccount(account);

            getUser()
                .then((response) => {
                    setUser(response);
                })
                .catch((error) => {
                    console.error("Failed to fetch user:", error);
                });
        }
    });

    return (
        <AuthContext.Provider value={{ user }}>
            <MsalProvider instance={msalInstance}>{children}</MsalProvider>
        </AuthContext.Provider>
    );
};

export function useAuthProvider() {
    return { AuthProvider }
}