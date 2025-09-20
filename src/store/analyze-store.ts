import { create } from "zustand";

export interface FileSettings {
  program?: string;
  analysisScope?: string[];
}

interface AnalyzeState {
  files: Record<string, FileSettings>;
  setFileSettings: (fileId: number, settings: Partial<FileSettings>) => void;
  getFileSettings: (fileId: number) => FileSettings;
  resetFile: (fileId: number) => void;
}

export const useAnalyzeStore = create<AnalyzeState>((set, get) => ({
  files: {},
  setFileSettings: (fileId, settings) =>
    set((state) => ({
      files: {
        ...state.files,
        [fileId]: {
          ...state.files[fileId],
          ...settings,
        },
      },
    })),
  getFileSettings: (fileId) => get().files[fileId] ?? {},
  resetFile: (fileId) =>
    set((state) => {
      const newFiles = { ...state.files };
      delete newFiles[fileId];
      return { files: newFiles };
    }),
}));
