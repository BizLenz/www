import { describe, it, expect, beforeEach, mock } from "bun:test";
import { renderHook, act } from "@testing-library/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAuthenticatedFetch = mock<(...args: any[]) => Promise<any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch = mock<(...args: any[]) => Promise<Response>>(
  () => Promise.resolve(new Response(null, { status: 200 })),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockUseSession = mock<() => any>(() => ({
  data: {
    user: { id: "user-1" },
    accessToken: "test-token",
    expires: "2099-01-01",
  },
  status: "authenticated",
}));

mock.module("next-auth/react", () => ({
  useSession: mockUseSession,
}));

mock.module("@/lib/api-client", () => ({
  authenticatedFetch: mockAuthenticatedFetch,
  serverFetch: mock(),
}));

mock.module("sonner", () => ({
  toast: { error: mock(), success: mock() },
}));

// Override global fetch for S3 upload
globalThis.fetch = mockFetch as unknown as typeof fetch;

const { useFileUpload } = await import("./use-file-upload");

function makePdfFile(name = "test.pdf", size = 1024): File {
  return new File(["x".repeat(size)], name, { type: "application/pdf" });
}

describe("useFileUpload", () => {
  beforeEach(() => {
    mockAuthenticatedFetch.mockReset();
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(new Response(null, { status: 200 }));
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
    const { result } = renderHook(() => useFileUpload());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe("validation", () => {
    it("rejects when not authenticated", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.uploadFile(makePdfFile());
      });

      expect(result.current.error).toBe("Not authenticated.");
    });

    it("rejects non-PDF file extension", async () => {
      const file = new File(["content"], "test.docx", {
        type: "application/pdf",
      });

      const { result } = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.uploadFile(file);
      });

      expect(result.current.error).toBe("Only PDF files are allowed.");
    });

    it("rejects wrong MIME type", async () => {
      const file = new File(["content"], "test.pdf", {
        type: "text/plain",
      });

      const { result } = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.uploadFile(file);
      });

      expect(result.current.error).toBe(
        "'application/pdf' MIME type only is allowed.",
      );
    });
  });

  describe("successful upload", () => {
    it("completes the full upload flow", async () => {
      // 1. getPresignedUrl
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: {
          presigned_url: "https://s3.example.com/upload",
          file_url: "https://s3.example.com/file.pdf",
          key: "uploads/file.pdf",
        },
        error: null,
      });

      // 2. uploadToS3 (uses global fetch)
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

      // 3. saveFileMetadata
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: { message: "Saved", file_id: 42 },
        error: null,
      });

      const { result } = renderHook(() => useFileUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadFile(makePdfFile());
      });

      expect(uploadResult).toEqual({
        fileId: 42,
        fileUrl: "https://s3.example.com/file.pdf",
        s3Key: "uploads/file.pdf",
      });
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("error scenarios", () => {
    it("handles presigned URL failure", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Server error", status_code: 500 },
      });

      const { result } = renderHook(() => useFileUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadFile(makePdfFile());
      });

      expect(uploadResult).toBeUndefined();
      expect(result.current.error).toBe("Server error");
    });

    it("handles S3 upload failure", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: {
          presigned_url: "https://s3.example.com/upload",
          file_url: "https://s3.example.com/file.pdf",
          key: "uploads/file.pdf",
        },
        error: null,
      });

      mockFetch.mockResolvedValueOnce(
        new Response(null, { status: 403, statusText: "Forbidden" }),
      );

      const { result } = renderHook(() => useFileUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadFile(makePdfFile());
      });

      expect(uploadResult).toBeUndefined();
      expect(result.current.error).toContain("Failed to upload file to S3");
    });

    it("handles metadata save failure", async () => {
      mockAuthenticatedFetch
        .mockResolvedValueOnce({
          data: {
            presigned_url: "https://s3.example.com/upload",
            file_url: "https://s3.example.com/file.pdf",
            key: "uploads/file.pdf",
          },
          error: null,
        })
        .mockResolvedValueOnce({
          data: null,
          error: { detail: "Metadata error", status_code: 500 },
        });

      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));

      const { result } = renderHook(() => useFileUpload());

      let uploadResult: unknown;
      await act(async () => {
        uploadResult = await result.current.uploadFile(makePdfFile());
      });

      expect(uploadResult).toBeUndefined();
      expect(result.current.error).toBe("Metadata error");
    });
  });

  describe("reset", () => {
    it("clears loading and error", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useFileUpload());

      await act(async () => {
        await result.current.uploadFile(makePdfFile());
      });
      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("options", () => {
    it("uses custom description from options", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: {
          presigned_url: "https://s3.example.com/upload",
          file_url: "https://s3.example.com/file.pdf",
          key: "uploads/file.pdf",
        },
        error: null,
      });
      mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }));
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: { message: "Saved", file_id: 1 },
        error: null,
      });

      const { result } = renderHook(() =>
        useFileUpload({ description: "Custom desc" }),
      );

      await act(async () => {
        await result.current.uploadFile(makePdfFile());
      });

      // Check presigned URL call includes description
      const presignedCall = mockAuthenticatedFetch.mock.calls[0]!;
      const presignedBody = JSON.parse(
        (presignedCall[2] as RequestInit).body as string,
      ) as Record<string, unknown>;
      expect(presignedBody.description).toBe("Custom desc");
    });
  });
});
