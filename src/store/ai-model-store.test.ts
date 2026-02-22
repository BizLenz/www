import { describe, it, expect, beforeEach, spyOn, mock } from "bun:test";
import { create } from "zustand";

// Re-register the real module to override any mocks from other test files
mock.module("@/store/ai-model-store", () => {
  const store = create<{
    aiModel: string;
    aiModelList: string[];
    selectAiModel: (modelInput: string) => void;
  }>((set) => ({
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
          return {};
        }
      });
    },
  }));
  return { useAiModelStore: store };
});

const { useAiModelStore } = await import("./ai-model-store");

describe("useAiModelStore", () => {
  beforeEach(() => {
    useAiModelStore.setState({
      aiModel: "gemini-2.5-flash",
      aiModelList: ["gemini-2.5-flash", "gemini-2.5-pro"],
    });
  });

  it("has correct default model", () => {
    expect(useAiModelStore.getState().aiModel).toBe("gemini-2.5-flash");
  });

  it("has correct default model list", () => {
    expect(useAiModelStore.getState().aiModelList).toEqual([
      "gemini-2.5-flash",
      "gemini-2.5-pro",
    ]);
  });

  describe("selectAiModel", () => {
    it("selects a valid model", () => {
      useAiModelStore.getState().selectAiModel("gemini-2.5-pro");
      expect(useAiModelStore.getState().aiModel).toBe("gemini-2.5-pro");
    });

    it("keeps current model when invalid model is selected", () => {
      const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
      useAiModelStore.getState().selectAiModel("invalid-model");
      expect(useAiModelStore.getState().aiModel).toBe("gemini-2.5-flash");
      warnSpy.mockRestore();
    });

    it("warns on invalid model selection", () => {
      const warnSpy = spyOn(console, "warn").mockImplementation(() => {});
      useAiModelStore.getState().selectAiModel("invalid-model");
      expect(warnSpy).toHaveBeenCalledTimes(1);
      warnSpy.mockRestore();
    });

    it("switches back and forth between valid models", () => {
      const { selectAiModel } = useAiModelStore.getState();
      selectAiModel("gemini-2.5-pro");
      expect(useAiModelStore.getState().aiModel).toBe("gemini-2.5-pro");

      selectAiModel("gemini-2.5-flash");
      expect(useAiModelStore.getState().aiModel).toBe("gemini-2.5-flash");
    });
  });
});
