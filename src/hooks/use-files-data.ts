import { useCallback, useEffect } from "react";
import { useFileStoreShallow } from "@/store/file-store";
import { useBackendToken } from "@/hooks/use-backend-token";

export function useFilesData() {
  const { fastApiToken } = useBackendToken();
  const store = useFileStoreShallow();
  const { files, isLoading, lastFetchSuccessful, fetchFiles } = store;

  const refetch = useCallback(() => {
    if (fastApiToken) void fetchFiles(fastApiToken);
  }, [fastApiToken, fetchFiles]);

  useEffect(() => {
    if (
      lastFetchSuccessful === null &&
      files.length === 0 &&
      !isLoading &&
      fastApiToken
    ) {
      void fetchFiles(fastApiToken);
    }
  }, [files.length, isLoading, fastApiToken, fetchFiles, lastFetchSuccessful]);

  return { ...store, refetch };
}
