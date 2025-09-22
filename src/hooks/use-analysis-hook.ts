import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface AnalysisRequest {
  s3_key: string;
  timeout_sec?: number;
  contest_type: string;
  json_model?: string;
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
        const response = await fetch("/api/v1/analysis/request", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...request,
            timeout_sec: request.timeout_sec || 300, // Default 5 minutes
            json_model: request.json_model || "gemini-2.5-flash", // Default model
          }),
        });

        if (!response.ok) {
          const errorData: ApiError = await response.json();
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const data: AnalysisResponse = await response.json();
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
