import React, { createContext, useContext, useEffect } from "react";
import Session from "../../models/dataplatform/Session";
import { useAuthStore } from "../../stores/dataplatform/authStore";

interface AuthContextType {
    session: Session | null;
    setSession: (session: Session | null) => void;
    clearSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { session, setSession, clearSession } = useAuthStore();

    useEffect(() => {
        if (session) {
            const isExpired = new Date(session.token_expire) <= new Date();
            if (isExpired) {
                clearSession();
            }
        }
    }, [session, clearSession]);

    return (
        <AuthContext.Provider value={{ session, setSession, clearSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
