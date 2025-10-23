import { create } from "zustand";
import { type File, fileSchema } from "@/types/file";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import { getErrorMessage } from "@/lib/utils";
import { type Session } from "next-auth";

export interface FileState {
  files: File[];
  isLoading: boolean;
  error: string | null;
  lastFetchSuccessful: boolean | null;
  fetchFiles: (session: Session) => Promise<void>;
}

export interface FileResponse {
  success: boolean;
  results: File[];
}

export const useFileStore = create<FileState>()((set, get) => ({
  files: [],
  isLoading: false,
  error: null,
  lastFetchSuccessful: null,
  fetchFiles: async (session: Session) => {
    if (get().isLoading) {
      console.log("Files already loaded or loading, skipping fetch.");
      return;
    }

    if (!session?.user) {
      set({ error: "User session not available.", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null, lastFetchSuccessful: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/files/search`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          "HTTP Error, status: " + response.status + ", message: " + errorText,
        );
      }

      const data: unknown = await response.json();
      console.log(data);

      const { success, results } = data as FileResponse;
      if (!success) {
        set({
          error: "Failed to fetch files: API reported failure.",
          isLoading: false,
          lastFetchSuccessful: false,
        });
        return;
      }
      const filesArraySchema = z.array(fileSchema);
      const validatedFiles = filesArraySchema.parse(results);
      set({
        files: validatedFiles,
        isLoading: false,
        lastFetchSuccessful: true,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Failed to fetch files:", err.message);
        set({
          error:
            "파일 데이터를 불러오는 데 실패했습니다: " +
            (err.message || "알 수 없는 오류"),
          isLoading: false,
        });
      } else {
        console.error("Failed to fetch files:", err);
        set({
          error:
            "파일 데이터를 불러오는 데 실패했습니다: " + getErrorMessage(err),
          isLoading: false,
        });
      }
    }
  },
}));

const BYTES_IN_MEGABYTE = 1_048_576;

export const useFileStoreShallow = () =>
  useFileStore(
    useShallow((state: FileState) => ({
      files: state.files,
      size: Number(
        (
          state.files.reduce((acc, file) => acc + (file.file_size ?? 0), 0) /
          BYTES_IN_MEGABYTE
        ).toFixed(2),
      ),
      isLoading: state.isLoading,
      error: state.error,
      lastFetchSuccessful: state.lastFetchSuccessful,
      fetchFiles: state.fetchFiles,
      sumAnalysis: state.files.reduce(
        (acc, file) => acc + (file.status === "completed" ? 1 : 0),
        0,
      ),
      sumProcessing: state.files.reduce(
        (acc, file) => acc + (file.status === "processing" ? 1 : 0),
        0,
      ),
      sumFilesNum: state.files.length,
    })),
  );
