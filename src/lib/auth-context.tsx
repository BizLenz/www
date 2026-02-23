"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

import { z } from "zod";
import { type BackendTokenResponse, backendTokenSchema } from "@/types/auth";
import { BackendTokenContext } from "@/lib/backend-token-context";

export { BackendTokenContext } from "@/lib/backend-token-context";

export function BackendTokenProvider({ children }: { children: ReactNode }) {
  const session = authClient.useSession();
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

  const isAuthenticated = !!session.data;
  const isPending = session.isPending;

  useEffect(() => {
    if (isAuthenticated) {
      if (!fastApiToken && !isLoadingFastApiToken) {
        void fetchToken();
      }
    } else if (!isPending) {
      if (fastApiToken || isLoadingFastApiToken || errorFastApiToken) {
        setFastApiToken(null);
        setIsLoadingFastApiToken(false);
        setErrorFastApiToken(null);
      }
    }
  }, [
    isAuthenticated,
    isPending,
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
