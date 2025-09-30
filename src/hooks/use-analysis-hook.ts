import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAiModelStore } from "@/store/analyze-store";

interface AnalysisRequest {
  file_path: string;
  timeout_sec?: number;
  contest_type: string;
  analysis_model?: string;
}

interface AnalysisResponse {
  report_json: string;
  sections_analyzed: number;
  contest_type: string;
}

interface ApiError {
  detail: string;
  status_code: number;
}

interface UseAnalysisHook {
  analyzeDocument: (
    request: AnalysisRequest,
  ) => Promise<AnalysisResponse | null>;
  isLoading: boolean;
  error: ApiError | null;
  resetError: () => void;
}

export const useAnalysis = (): UseAnalysisHook => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { aiModel } = useAiModelStore();

  const analyzeDocument = useCallback(
    async (request: AnalysisRequest): Promise<AnalysisResponse | null> => {
      setIsLoading(true);
      setError(null);

      if (!session?.accessToken) {
        toast.error("로그인 후에 파일을 업로드할 수 있습니다.");
        setError({ detail: "Not authenticated.", status_code: 401 });
        return null;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluation/request`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...request,
              timeout_sec: request.timeout_sec ?? 300, // Default 5 minutes
              analysis_model: aiModel,
            }),
          },
        );

        if (!response.ok) {
          const errorData = (await response.json()) as ApiError;
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const data = (await response.json()) as AnalysisResponse;
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "분석 요청 중 오류 발생";
        setError({
          detail: errorMessage,
          status_code:
            err instanceof Error && err.message.includes("404") ? 404 : 500,
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyzeDocument,
    isLoading,
    error,
    resetError,
  };
};
