"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useSession } from "next-auth/react";

import { z } from "zod";
import { type BackendTokenResponse, backendTokenSchema } from "@/types/auth"; // Adjust path

interface BackendTokenContextType {
  fastApiToken: string | null;
  isLoadingFastApiToken: boolean;
  errorFastApiToken: string | null;
  refreshFastApiToken: () => Promise<void>;
}

export const BackendTokenContext = createContext<
  BackendTokenContextType | undefined
>(undefined);

export function BackendTokenProvider({ children }: { children: ReactNode }) {
  const { status: sessionStatus } = useSession();
  const [fastApiToken, setFastApiToken] = useState<string | null>(null);
  const [isLoadingFastApiToken, setIsLoadingFastApiToken] = useState(false);
  const [errorFastApiToken, setErrorFastApiToken] = useState<string | null>(
    null,
  );

  const fetchToken = useCallback(async () => {
    setIsLoadingFastApiToken(true);
    setErrorFastApiToken(null);
    try {
      const res = await fetch("/api/backend-token");
      if (!res.ok) {
        throw new Error(
          `Failed to fetch backend token: ${res.status} ${res.statusText}`,
        );
      }
      const rawData: unknown = await res.json();
      const parsedData: BackendTokenResponse =
        backendTokenSchema.parse(rawData);
      const { token } = parsedData;
      setFastApiToken(token);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";

      if (err instanceof z.ZodError) {
        errorMessage = `Invalid token response: ${err.issues[0]?.message ?? "Data format mismatch"}`;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        setErrorFastApiToken(errorMessage);
        setFastApiToken(null);
      }
    } finally {
      setIsLoadingFastApiToken(false);
    }
  }, []);

  const refreshFastApiToken = useCallback(async () => {
    await fetchToken();
  }, [fetchToken]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (!fastApiToken && !isLoadingFastApiToken) {
        void fetchToken();
      }
    } else if (sessionStatus !== "loading") {
      if (fastApiToken || isLoadingFastApiToken || errorFastApiToken) {
        setFastApiToken(null);
        setIsLoadingFastApiToken(false);
        setErrorFastApiToken(null);
      }
    }
  }, [
    sessionStatus,
    fastApiToken,
    isLoadingFastApiToken,
    fetchToken,
    errorFastApiToken,
  ]);

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
