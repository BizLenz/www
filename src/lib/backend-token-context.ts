import { createContext } from "react";

export interface BackendTokenContextType {
  fastApiToken: string | null;
  isLoadingFastApiToken: boolean;
  errorFastApiToken: string | null;
  refreshFastApiToken: () => Promise<void>;
}

export const BackendTokenContext = createContext<
  BackendTokenContextType | undefined
>(undefined);
