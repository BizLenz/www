import { create } from "zustand";
import { type File, fileSchema } from "@/types/file";
import { z } from "zod";
import { useShallow } from "zustand/shallow";
import { getErrorMessage } from "@/lib/utils";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api-client";

const BYTES_IN_MEGABYTE = 1_048_576;

function computeSize(files: File[]): number {
  return Number(
    (
      files.reduce((acc, file) => acc + (file.file_size ?? 0), 0) /
      BYTES_IN_MEGABYTE
    ).toFixed(2),
  );
}

export interface FileState {
  files: File[];
  size: number;
  sumAnalysis: number;
  sumProcessing: number;
  sumFilesNum: number;
  isLoading: boolean;
  error: string | null;
  lastFetchSuccessful: boolean | null;
  fetchFiles: (token: string) => Promise<void>;
}

export interface FileResponse {
  success: boolean;
  results: File[];
}

export const useFileStore = create<FileState>()((set, get) => ({
  files: [],
  size: 0,
  sumAnalysis: 0,
  sumProcessing: 0,
  sumFilesNum: 0,
  isLoading: false,
  error: null,
  lastFetchSuccessful: null,
  fetchFiles: async (token: string) => {
    if (get().isLoading) return;

    if (!token) {
      set({ error: "Not authenticated.", isLoading: false });
      return;
    }

    set({ isLoading: true, error: null, lastFetchSuccessful: null });
    try {
      const { data, error } = await authenticatedFetch<FileResponse>(
        API_ENDPOINTS.files.search,
        token,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (error) throw new Error(error.detail);

      if (!data?.success) {
        set({
          error: "Failed to fetch files: API reported failure.",
          isLoading: false,
          lastFetchSuccessful: false,
        });
        return;
      }

      const files = z.array(fileSchema).parse(data.results);
      set({
        files,
        size: computeSize(files),
        sumAnalysis: files.filter((f) => f.status === "completed").length,
        sumProcessing: files.filter((f) => f.status === "processing").length,
        sumFilesNum: files.length,
        isLoading: false,
        lastFetchSuccessful: true,
      });
    } catch (err: unknown) {
      set({
        error:
          "파일 데이터를 불러오는 데 실패했습니다: " + getErrorMessage(err),
        isLoading: false,
        lastFetchSuccessful: false,
      });
    }
  },
}));

export const useFileStoreShallow = () =>
  useFileStore(
    useShallow((state: FileState) => ({
      files: state.files,
      size: state.size,
      isLoading: state.isLoading,
      error: state.error,
      lastFetchSuccessful: state.lastFetchSuccessful,
      fetchFiles: state.fetchFiles,
      sumAnalysis: state.sumAnalysis,
      sumProcessing: state.sumProcessing,
      sumFilesNum: state.sumFilesNum,
    })),
  );
