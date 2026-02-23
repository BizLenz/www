import { useContext } from "react";
import { BackendTokenContext } from "@/lib/backend-token-context";

export function useBackendToken() {
  const context = useContext(BackendTokenContext);
  if (context === undefined) {
    throw new Error(
      "useBackendToken must be used within a BackendTokenProvider",
    );
  }
  return context;
}
