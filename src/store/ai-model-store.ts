import { create } from "zustand";

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
