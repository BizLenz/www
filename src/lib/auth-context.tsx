"use client";

import {createContext, type ReactNode, useCallback, useEffect, useState,} from "react";
import {useSession} from "next-auth/react";

interface BackendTokenContextType {
    fastApiToken: string | null;
    isLoadingFastApiToken: boolean;
    errorFastApiToken: string | null;
    refreshFastApiToken: () => Promise<void>;
}

export const BackendTokenContext = createContext<
    BackendTokenContextType | undefined
>(undefined);

interface BackendTokenResponse {
    token: string;
}

export function BackendTokenProvider({children}: { children: ReactNode }) {
    const {data: session, status: sessionStatus} = useSession();
    const [fastApiToken, setFastApiToken] = useState<string | null>(null);
    const [isLoadingFastApiToken, setIsLoadingFastApiToken] = useState(false);
    const [errorFastApiToken, setErrorFastApiToken] = useState<string | null>(
        null,
    );

    const fetchToken = useCallback(async () => {
        setIsLoadingFastApiToken(true);
        setErrorFastApiToken(null);
        try {
            console.log(
                "BackendTokenProvider: Initiating fetch for backend token...",
            );
            const res = await fetch("/api/backend-token");
            if (!res.ok) {
                throw new Error(
                    `Failed to fetch backend token: ${res.status} ${res.statusText}`,
                );
            }
            const {token}: BackendTokenResponse = await res.json();
            setFastApiToken(token);
        } catch (err: any) {
            console.error("BackendTokenProvider: Error fetching token:", err);
            setErrorFastApiToken(err.message || "Unknown error fetching token");
            setFastApiToken(null);
        } finally {
            console.log(
                "BackendTokenProvider: Fetch finished, setting isLoadingFastApiToken to false.",
            );
            setIsLoadingFastApiToken(false);
        }
    }, []);

    const refreshFastApiToken = useCallback(async () => {
        await fetchToken();
    }, [fetchToken]);

    useEffect(() => {
        console.log("useEffect running. sessionStatus:", sessionStatus);

        if (sessionStatus === "authenticated") {
            if (!fastApiToken && !isLoadingFastApiToken) {
                console.log(
                    "BackendTokenProvider: session authenticated, fastApiToken not present, initiating fetch.",
                );
                void fetchToken();
            } else if (fastApiToken) {
                console.log(
                    "BackendTokenProvider: session authenticated, fastApiToken already present.",
                );
            } else if (isLoadingFastApiToken) {
                console.log(
                    "BackendTokenProvider: session authenticated, token already loading.",
                );
            }
        } else if (sessionStatus === "loading") {
            console.log("BackendTokenProvider: session status is 'loading'.");
        } else {
            if (fastApiToken || isLoadingFastApiToken || errorFastApiToken) {
                console.log(
                    "BackendTokenProvider: Session not authenticated, resetting token states.",
                );
                setFastApiToken(null);
                setIsLoadingFastApiToken(false);
                setErrorFastApiToken(null);
            } else {
                console.log(
                    "BackendTokenProvider: Session not authenticated and states already cleared.",
                );
            }
        }
    }, [sessionStatus, fastApiToken, isLoadingFastApiToken, fetchToken]);

    return (
        <BackendTokenContext.Provider
            value={{
                fastApiToken,
                isLoadingFastApiToken,
                errorFastApiToken,
                refreshFastApiToken,
            }}
        >
            {children}
        </BackendTokenContext.Provider>
    );
}