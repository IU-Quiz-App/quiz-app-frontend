import { AuthenticationResult, EventType } from "@azure/msal-browser";
import { msalInstance } from "../AuthConfig.ts";
import { MsalProvider } from "@azure/msal-react";
import {User} from "@services/Types.ts";
import {Context, createContext, useEffect, useState} from "react";

interface AuthContextType {
    user: User|undefined;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
) as Context<AuthContextType>;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | undefined>(undefined);

    if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
        const account = msalInstance.getAllAccounts()[0];
        msalInstance.setActiveAccount(account);
    }

    msalInstance.enableAccountStorageEvents();

    msalInstance.addEventCallback((event) => {
        var authenticationResult = event?.payload as AuthenticationResult;
        if (event.eventType === EventType.LOGIN_SUCCESS && authenticationResult?.account) {
            const account = authenticationResult.account;
            msalInstance.setActiveAccount(account);

            //@ts-ignore
            const state = event?.payload?.state;
            try {
                const parsedState = state ? JSON.parse(state) : {};
                const redirectTo = parsedState.redirectTo || '/dashboard';
                window.location.replace(redirectTo); // 👈 safer than reload()
            } catch (e) {
                console.warn("Failed to parse redirect state:", e);
                window.location.replace('/dashboard');
            }
        }
    });

    useEffect(() => {
        const account = msalInstance.getActiveAccount();
        if (account) {
            const firstName = account?.name?.split(' ')[0];
            const uuid = account?.idTokenClaims?.oid;

            const user = {
                nickname: firstName,
                user_uuid: uuid,
            } as User;

            setUser(user);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            <MsalProvider instance={msalInstance}>{children}</MsalProvider>
        </AuthContext.Provider>
    );
};

export function useAuthProvider() {
    return { AuthProvider }
}