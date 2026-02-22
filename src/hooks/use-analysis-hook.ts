import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useAiModelStore } from "@/store/ai-model-store";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch, type ApiError } from "@/lib/api-client";

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

interface AnalysisResultRequest {
  id: number;
}

interface UseAnalysisHook {
  analyzeDocument: (
    request: AnalysisRequest,
  ) => Promise<AnalysisResponse | null>;
  getAnalysisResult: (
    request: AnalysisResultRequest,
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

      try {
        const { data, error: fetchError } =
          await authenticatedFetch<AnalysisResponse>(
            API_ENDPOINTS.evaluation.request,
            session?.accessToken,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...request,
                timeout_sec: request.timeout_sec ?? 300,
                analysis_model: aiModel,
              }),
            },
          );

        if (fetchError) {
          if (fetchError.status_code === 401)
            toast.error("로그인 후에 파일을 업로드할 수 있습니다.");
          setError(fetchError);
          return null;
        }

        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [session, aiModel],
  );

  const getAnalysisResult = useCallback(
    async (
      request: AnalysisResultRequest,
    ): Promise<AnalysisResponse | null> => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: REMOVE def
        const resultId = request.id || 16;
        const { data, error: fetchError } =
          await authenticatedFetch<AnalysisResponse>(
            API_ENDPOINTS.evaluation.results(resultId),
            session?.accessToken,
          );

        if (fetchError) {
          if (fetchError.status_code === 401)
            toast.error("로그인 후에 파일을 업로드할 수 있습니다.");
          setError(fetchError);
          return null;
        }

        return data;
      } finally {
        setIsLoading(false);
      }
    },
    [session, aiModel],
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    analyzeDocument,
    getAnalysisResult,
    isLoading,
    error,
    resetError,
  };
};
