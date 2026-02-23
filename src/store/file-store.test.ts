import { describe, it, expect, beforeEach, mock } from "bun:test";
import type { Session } from "next-auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAuthenticatedFetch = mock<(...args: any[]) => Promise<any>>();

void mock.module("@/lib/api-client", () => ({
  authenticatedFetch: mockAuthenticatedFetch,
  serverFetch: mock(),
}));

const { useFileStore } = await import("./file-store");

function makeSession(overrides?: Partial<Session>): Session {
  return {
    user: { id: "user-1", name: "Test", email: "test@test.com" },
    accessToken: "test-token",
    expires: "2099-01-01",
    ...overrides,
  } as Session;
}

describe("useFileStore", () => {
  beforeEach(() => {
    useFileStore.setState({
      files: [],
      isLoading: false,
      error: null,
      lastFetchSuccessful: null,
    });
    mockAuthenticatedFetch.mockReset();
  });

  it("starts with empty state", () => {
    const state = useFileStore.getState();
    expect(state.files).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.lastFetchSuccessful).toBeNull();
  });

  describe("fetchFiles", () => {
    it("sets error when session has no user", async () => {
      await useFileStore
        .getState()
        .fetchFiles({ expires: "2099-01-01" } as Session);

      const state = useFileStore.getState();
      expect(state.error).toBe("User session not available.");
      expect(state.isLoading).toBe(false);
    });

    it("sets isLoading during fetch", async () => {
      let resolvePromise!: (v: unknown) => void;
      mockAuthenticatedFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolvePromise = resolve;
          }),
      );

      const fetchPromise = useFileStore.getState().fetchFiles(makeSession());

      expect(useFileStore.getState().isLoading).toBe(true);

      resolvePromise({
        data: { success: true, results: [] },
        error: null,
      });
      await fetchPromise;

      expect(useFileStore.getState().isLoading).toBe(false);
    });

    it("sets files on successful fetch", async () => {
      const files = [
        { id: 1, file_name: "a.pdf", file_path: "/a.pdf" },
        { id: 2, file_name: "b.pdf", file_path: "/b.pdf" },
      ];

      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: { success: true, results: files },
        error: null,
      });

      await useFileStore.getState().fetchFiles(makeSession());

      const state = useFileStore.getState();
      expect(state.files).toHaveLength(2);
      expect(state.files[0]!.file_name).toBe("a.pdf");
      expect(state.lastFetchSuccessful).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("sets error when API returns failure", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: { success: false, results: [] },
        error: null,
      });

      await useFileStore.getState().fetchFiles(makeSession());

      const state = useFileStore.getState();
      expect(state.error).toBe("Failed to fetch files: API reported failure.");
      expect(state.lastFetchSuccessful).toBe(false);
    });

    it("sets error when authenticatedFetch returns error", async () => {
      mockAuthenticatedFetch.mockResolvedValueOnce({
        data: null,
        error: { detail: "Server error", status_code: 500 },
      });

      await useFileStore.getState().fetchFiles(makeSession());

      const state = useFileStore.getState();
      expect(state.error).toContain("Server error");
      expect(state.isLoading).toBe(false);
    });

    it("prevents concurrent fetches", async () => {
      let resolveFirst!: (v: unknown) => void;
      mockAuthenticatedFetch.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      );

      const session = makeSession();
      const first = useFileStore.getState().fetchFiles(session);
      // Second call while first is loading — should bail out
      const second = useFileStore.getState().fetchFiles(session);

      resolveFirst({
        data: { success: true, results: [] },
        error: null,
      });

      await first;
      await second;

      expect(mockAuthenticatedFetch).toHaveBeenCalledTimes(1);
    });

    it("handles network/parse errors gracefully", async () => {
      mockAuthenticatedFetch.mockRejectedValueOnce(
        new Error("Network failure"),
      );

      await useFileStore.getState().fetchFiles(makeSession());

      const state = useFileStore.getState();
      expect(state.error).toContain("Network failure");
      expect(state.isLoading).toBe(false);
    });
  });
});
