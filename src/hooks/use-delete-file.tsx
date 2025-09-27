import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

interface FileDeleteOptions {
  file_id?: number;
}

interface FileDeleteResult {
  success: boolean;
  message: string;
  deleted_file_id: number;
}

interface FileDeleteErrorResponse {
  detail: string;
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

      // Use options.file_id if provided, otherwise use parameter
      const targetFileId = file_id ?? options?.file_id;

      if (!session?.accessToken) {
        const errorMessage = "로그인 후에 파일을 삭제할 수 있습니다.";
        toast.error(errorMessage);
        setError("Not authenticated.");
        setIsPending(false);
        return undefined;
      }

      if (!targetFileId || targetFileId <= 0) {
        const errorMessage = "유효한 파일 ID가 필요합니다.";
        toast.error(errorMessage);
        setError("Invalid file ID.");
        setIsPending(false);
        return undefined;
      }

      try {
        const deleteResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/${targetFileId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!deleteResponse.ok) {
          const errorData = (await deleteResponse
            .json()
            .catch(() => ({}))) as FileDeleteErrorResponse;
          const errorMessage =
            errorData.detail ||
            `파일 삭제 실패: ${deleteResponse.status} ${deleteResponse.statusText}`;
          throw new Error(errorMessage);
        }

        const deleteResult = (await deleteResponse.json()) as FileDeleteResult;

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
