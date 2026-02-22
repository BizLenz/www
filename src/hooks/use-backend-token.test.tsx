import { describe, it, expect } from "bun:test";
import { renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { BackendTokenContext } from "@/lib/auth-context";
import { useBackendToken } from "./use-backend-token";

function wrapper(value: {
  fastApiToken: string | null;
  isLoadingFastApiToken: boolean;
  errorFastApiToken: string | null;
  refreshFastApiToken: () => Promise<void>;
}) {
  const Wrapper = ({ children }: { children: ReactNode }) =>
    createElement(BackendTokenContext.Provider, { value }, children);
  Wrapper.displayName = "BackendTokenWrapper";
  return Wrapper;
}

describe("useBackendToken", () => {
  it("returns context value when inside provider", () => {
    const contextValue = {
      fastApiToken: "test-token",
      isLoadingFastApiToken: false,
      errorFastApiToken: null,
      refreshFastApiToken: async () => { /* noop */ },
    };

    const { result } = renderHook(() => useBackendToken(), {
      wrapper: wrapper(contextValue),
    });

    expect(result.current.fastApiToken).toBe("test-token");
    expect(result.current.isLoadingFastApiToken).toBe(false);
    expect(result.current.errorFastApiToken).toBeNull();
  });

  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useBackendToken());
    }).toThrow("useBackendToken must be used within a BackendTokenProvider");
  });

  it("returns loading state", () => {
    const contextValue = {
      fastApiToken: null,
      isLoadingFastApiToken: true,
      errorFastApiToken: null,
      refreshFastApiToken: async () => { /* noop */ },
    };

    const { result } = renderHook(() => useBackendToken(), {
      wrapper: wrapper(contextValue),
    });

    expect(result.current.isLoadingFastApiToken).toBe(true);
    expect(result.current.fastApiToken).toBeNull();
  });

  it("returns error state", () => {
    const contextValue = {
      fastApiToken: null,
      isLoadingFastApiToken: false,
      errorFastApiToken: "Token fetch failed",
      refreshFastApiToken: async () => { /* noop */ },
    };

    const { result } = renderHook(() => useBackendToken(), {
      wrapper: wrapper(contextValue),
    });

    expect(result.current.errorFastApiToken).toBe("Token fetch failed");
  });
});
