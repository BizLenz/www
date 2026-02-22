import { describe, it, expect, beforeEach, mock } from "bun:test";
import { renderHook, act } from "@testing-library/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAuthenticatedFetch = mock<(...args: any[]) => Promise<any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseSession = mock<() => any>(() => ({
  data: {
    user: { id: "user-1" },
    accessToken: "test-token",
    expires: "2099-01-01",
  },
  status: "authenticated",
}));

void mock.module("next-auth/react", () => ({
  useSession: mockUseSession,
}));

void mock.module("@/lib/api-client", () => ({
  authenticatedFetch: mockAuthenticatedFetch,
  serverFetch: mock(),
}));

void mock.module("sonner", () => ({
  toast: { error: mock(), success: mock() },
}));

void mock.module("@/store/ai-model-store", () => ({
  useAiModelStore: () => ({ aiModel: "gemini-2.5-flash" }),
}));

const { useAnalysis } = await import("./use-analysis-hook");

describe("useAnalysis", () => {
  beforeEach(() => {
    mockAuthenticatedFetch.mockReset();
    mockUseSession.mockReturnValue({
      data: {
        user: { id: "user-1" },
        accessToken: "test-token",
        expires: "2099-01-01",
      },
      status: "authenticated",
    });
  });

  it("starts with idle state", () => {
    const { result } = renderHook(() => useAnalysis());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe("analyzeDocument", () => {
    it("returns data on success", async () => {
      const response = {
        report_json: '{"score": 85}',
        sections_analyzed: 5,
        contest_type: "startup",
      };
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: response,
        error: null,
      });

      const { result } = renderHook(() => useAnalysis());

      let data: unknown;
      await act(async () => {
        data = await result.current.analyzeDocument({
          file_path: "/test.pdf",
          contest_type: "startup",
        });
      });

      expect(data).toEqual(response);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("sets error on API failure", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Server error", status_code: 500 },
      });

      const { result } = renderHook(() => useAnalysis());

      let data: unknown;
      await act(async () => {
        data = await result.current.analyzeDocument({
          file_path: "/test.pdf",
          contest_type: "startup",
        });
      });

      expect(data).toBeNull();
      expect(result.current.error).toEqual({
        detail: "Server error",
        status_code: 500,
      });
    });

    it("sets error on 401 unauthorized", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Unauthorized", status_code: 401 },
      });

      const { result } = renderHook(() => useAnalysis());

      await act(async () => {
        await result.current.analyzeDocument({
          file_path: "/test.pdf",
          contest_type: "startup",
        });
      });

      expect(result.current.error?.status_code).toBe(401);
    });

    it("sends correct request body with default timeout", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: { report_json: "{}", sections_analyzed: 0, contest_type: "test" },
        error: null,
      });

      const { result } = renderHook(() => useAnalysis());

      await act(async () => {
        await result.current.analyzeDocument({
          file_path: "/test.pdf",
          contest_type: "startup",
        });
      });

      const callArgs = mockAuthenticatedFetch.mock.calls[0]!;
      const body = JSON.parse(
        (callArgs[2] as RequestInit).body as string,
      ) as Record<string, unknown>;
      expect(body.timeout_sec).toBe(300);
      expect(body.analysis_model).toBe("gemini-2.5-flash");
      expect(body.file_path).toBe("/test.pdf");
    });

    it("uses custom timeout when provided", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: { report_json: "{}", sections_analyzed: 0, contest_type: "test" },
        error: null,
      });

      const { result } = renderHook(() => useAnalysis());

      await act(async () => {
        await result.current.analyzeDocument({
          file_path: "/test.pdf",
          contest_type: "startup",
          timeout_sec: 600,
        });
      });

      const callArgs = mockAuthenticatedFetch.mock.calls[0]!;
      const body = JSON.parse(
        (callArgs[2] as RequestInit).body as string,
      ) as Record<string, unknown>;
      expect(body.timeout_sec).toBe(600);
    });

    it("clears loading after completion", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Error", status_code: 500 },
      });

      const { result } = renderHook(() => useAnalysis());

      await act(async () => {
        await result.current.analyzeDocument({
          file_path: "/test.pdf",
          contest_type: "startup",
        });
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("getAnalysisResult", () => {
    it("returns data on success", async () => {
      const response = {
        report_json: '{"score": 90}',
        sections_analyzed: 3,
        contest_type: "enterprise",
      };
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: response,
        error: null,
      });

      const { result } = renderHook(() => useAnalysis());

      let data: unknown;
      await act(async () => {
        data = await result.current.getAnalysisResult({ id: 42 });
      });

      expect(data).toEqual(response);
    });

    it("sets error on failure", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Not found", status_code: 404 },
      });

      const { result } = renderHook(() => useAnalysis());

      let data: unknown;
      await act(async () => {
        data = await result.current.getAnalysisResult({ id: 99 });
      });

      expect(data).toBeNull();
      expect(result.current.error?.detail).toBe("Not found");
    });

    it("sets error on 401 unauthorized", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Unauthorized", status_code: 401 },
      });

      const { result } = renderHook(() => useAnalysis());

      await act(async () => {
        await result.current.getAnalysisResult({ id: 1 });
      });

      expect(result.current.error?.status_code).toBe(401);
    });
  });

  describe("resetError", () => {
    it("clears the error state", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Error", status_code: 500 },
      });

      const { result } = renderHook(() => useAnalysis());

      await act(async () => {
        await result.current.analyzeDocument({
          file_path: "/test.pdf",
          contest_type: "startup",
        });
      });
      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.resetError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
