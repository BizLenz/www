"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";

interface BackendTokenContextType {
    fastApiToken: string | null;
    isLoadingFastApiToken: boolean;
    errorFastApiToken: string | null;
    // TODO: Add a function to refresh the token here
}

export const BackendTokenContext = createContext<BackendTokenContextType | undefined>(undefined);

interface BackendTokenResponse {
    token: string;
}

export function BackendTokenProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [fastApiToken, setFastApiToken] = useState<string | null>(null);
    const [isLoadingFastApiToken, setIsLoadingFastApiToken] = useState(false);
    const [errorFastApiToken, setErrorFastApiToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchBackendToken = async () => {
            if (status === "authenticated" && !fastApiToken && !isLoadingFastApiToken) {
                setIsLoadingFastApiToken(true);
                setErrorFastApiToken(null);
                try {
                    const res = await fetch("/api/backend-token");
                    if (!res.ok) {
                        throw new Error(`Failed to fetch backend token: ${res.statusText}`);
                    }
                    const { token }: BackendTokenResponse = await res.json();
                    setFastApiToken(token);
                } catch (err: any) {
                    console.error("Error fetching backend token:", err);
                    setErrorFastApiToken(err.message || "Unknown error fetching token");
                } finally {
                    setIsLoadingFastApiToken(false);
                }
            }
        };
        void fetchBackendToken();
    }, [status, fastApiToken, isLoadingFastApiToken]);

    return (
        <BackendTokenContext.Provider value={{ fastApiToken, isLoadingFastApiToken, errorFastApiToken }}>
            {children}
        </BackendTokenContext.Provider>
    );
}