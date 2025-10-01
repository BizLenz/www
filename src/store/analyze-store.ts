import { create } from "zustand";

export interface FileSettings {
  contestType?: string;
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

interface AiModelState {
  aiModel: string;
  aiModelList: string[];
  selectAiModel: (modelInput: string) => void;
}

export const useAiModelStore = create<AiModelState>((set) => ({
  aiModel: "gemini-2.5-flash",
  aiModelList: ["gemini-2.5-flash", "gemini-2.5-pro"],
  selectAiModel: (modelInput: string) => {
    set((state) => {
      if (state.aiModelList.includes(modelInput)) {
        return { aiModel: modelInput };
      } else {
        console.warn(
          `Invalid AI model selected: ${modelInput}. Keeping current model: ${state.aiModel}`,
        );
        return {}; // Return empty object to not update state
      }
    });
  },
}));
