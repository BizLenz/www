import { describe, it, expect, beforeEach, mock } from "bun:test";
import { renderHook, act } from "@testing-library/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAuthenticatedFetch = mock<(...args: any[]) => Promise<any>>();

const mockUseBackendToken = mock(() => ({
  fastApiToken: "test-token" as string | null,
  isLoadingFastApiToken: false,
  errorFastApiToken: null as string | null,
  refreshFastApiToken: async () => {
    /* noop */
  },
}));

void mock.module("@/hooks/use-backend-token", () => ({
  useBackendToken: mockUseBackendToken,
}));

void mock.module("@/lib/api-client", () => ({
  authenticatedFetch: mockAuthenticatedFetch,
  serverFetch: mock(),
}));

void mock.module("sonner", () => ({
  toast: { error: mock(), success: mock() },
}));

const { useFileDelete } = await import("./use-delete-file");

describe("useFileDelete", () => {
  beforeEach(() => {
    mockAuthenticatedFetch.mockReset();
    mockUseBackendToken.mockReturnValue({
      fastApiToken: "test-token",
      isLoadingFastApiToken: false,
      errorFastApiToken: null,
      refreshFastApiToken: async () => {
        /* noop */
      },
    });
  });

  it("starts with idle state", () => {
    const { result } = renderHook(() => useFileDelete());
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deletes a file successfully", async () => {
    mockAuthenticatedFetch.mockResolvedValueOnce({
      data: { success: true, message: "Deleted", deleted_file_id: 5 },
      error: null,
    });

    const { result } = renderHook(() => useFileDelete());

    let deleteResult: unknown;
    await act(async () => {
      deleteResult = await result.current.mutate(5);
    });

    expect(deleteResult).toEqual({
      success: true,
      message: "Deleted",
      deleted_file_id: 5,
    });
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("uses file_id from options when not passed to mutate", async () => {
    mockAuthenticatedFetch.mockResolvedValueOnce({
      data: { success: true, message: "Deleted", deleted_file_id: 10 },
      error: null,
    });

    const { result } = renderHook(() => useFileDelete({ file_id: 10 }));

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.error).toBeNull();
  });

  it("sets error when not authenticated", async () => {
    mockUseBackendToken.mockReturnValue({
      fastApiToken: null,
      isLoadingFastApiToken: false,
      errorFastApiToken: null,
      refreshFastApiToken: async () => {
        /* noop */
      },
    });

    const { result } = renderHook(() => useFileDelete());

    await act(async () => {
      await result.current.mutate(5);
    });

    expect(result.current.error).toBe("Not authenticated.");
    expect(result.current.isPending).toBe(false);
  });

  it("sets error for invalid file ID (0)", async () => {
    const { result } = renderHook(() => useFileDelete());

    await act(async () => {
      await result.current.mutate(0);
    });

    expect(result.current.error).toBe("Invalid file ID.");
  });

  it("sets error for negative file ID", async () => {
    const { result } = renderHook(() => useFileDelete());

    await act(async () => {
      await result.current.mutate(-1);
    });

    expect(result.current.error).toBe("Invalid file ID.");
  });

  it("sets error when no file ID is provided at all", async () => {
    const { result } = renderHook(() => useFileDelete());

    await act(async () => {
      await result.current.mutate();
    });

    expect(result.current.error).toBe("Invalid file ID.");
  });

  it("handles API returning fetchError", async () => {
    mockAuthenticatedFetch.mockResolvedValueOnce({
      data: null,
      error: { detail: "Not found", status_code: 404 },
    });

    const { result } = renderHook(() => useFileDelete());

    await act(async () => {
      await result.current.mutate(5);
    });

    expect(result.current.error).toBe("Not found");
  });

  it("handles API returning success: false", async () => {
    mockAuthenticatedFetch.mockResolvedValueOnce({
      data: { success: false, message: "Cannot delete", deleted_file_id: 5 },
      error: null,
    });

    const { result } = renderHook(() => useFileDelete());

    await act(async () => {
      await result.current.mutate(5);
    });

    expect(result.current.error).toBe("Cannot delete");
  });

  it("resets error and isPending state", async () => {
    mockUseBackendToken.mockReturnValue({
      fastApiToken: null,
      isLoadingFastApiToken: false,
      errorFastApiToken: null,
      refreshFastApiToken: async () => {
        /* noop */
      },
    });

    const { result } = renderHook(() => useFileDelete());

    await act(async () => {
      await result.current.mutate(5);
    });
    expect(result.current.error).toBe("Not authenticated.");

    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
  });
});
