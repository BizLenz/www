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
  const { data: session, status: sessionStatus } = useSession();
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
      const rawData: unknown = await res.json();
      const parsedData: BackendTokenResponse =
        backendTokenSchema.parse(rawData);
      const { token } = parsedData;
      setFastApiToken(token);
    } catch (err: unknown) {
      let errorMessage = "An unknown error occurred.";

      if (err instanceof z.ZodError) {
        console.error(
          "BackendTokenProvider: Zod validation error:",
          err.issues,
        );
        errorMessage = `Invalid token response: ${err.issues[0]?.message ?? "Data format mismatch"}`;
      } else if (err instanceof Error) {
        console.error(
          "BackendTokenProvider: Error fetching token:",
          err.message,
        );
        errorMessage = err.message;
      } else {
        setErrorFastApiToken(errorMessage);
        setFastApiToken(null);
      }
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
