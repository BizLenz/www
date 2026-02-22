import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api-client";

interface FileDeleteOptions {
  file_id?: number;
}

interface FileDeleteResult {
  success: boolean;
  message: string;
  deleted_file_id: number;
}

interface UseFileDelete {
  mutate: (file_id?: number) => Promise<FileDeleteResult | undefined>;
  isPending: boolean;
  error: string | null;
  reset: () => void;
}

export const useFileDelete = (options?: FileDeleteOptions): UseFileDelete => {
  const { data: session } = useSession();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (file_id?: number): Promise<FileDeleteResult | undefined> => {
      setError(null);
      setIsPending(true);

      const targetFileId = file_id ?? options?.file_id;

      if (!session?.accessToken) {
        toast.error("로그인 후에 파일을 삭제할 수 있습니다.");
        setError("Not authenticated.");
        setIsPending(false);
        return undefined;
      }

      if (!targetFileId || targetFileId <= 0) {
        toast.error("유효한 파일 ID가 필요합니다.");
        setError("Invalid file ID.");
        setIsPending(false);
        return undefined;
      }

      try {
        const { data: deleteResult, error: fetchError } =
          await authenticatedFetch<FileDeleteResult>(
            API_ENDPOINTS.files.delete(targetFileId),
            session.accessToken,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            },
          );

        if (fetchError || !deleteResult)
          throw new Error(
            fetchError?.detail ?? `파일 삭제 실패: ${targetFileId}`,
          );

        if (deleteResult.success) {
          toast.success(
            `파일이 성공적으로 삭제되었습니다. (ID: ${deleteResult.deleted_file_id})`,
          );
        } else {
          throw new Error(deleteResult.message || "파일 삭제에 실패했습니다.");
        }

        return deleteResult;
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(errorMessage);
        return undefined;
      } finally {
        setIsPending(false);
      }
    },
    [session, options?.file_id],
  );

  const reset = useCallback(() => {
    setIsPending(false);
    setError(null);
  }, []);

  return {
    mutate,
    isPending,
    error,
    reset,
  };
};
