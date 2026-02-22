import { describe, it, expect, beforeEach } from "bun:test";
import { useAnalyzeStore } from "./analysis-store";

describe("useAnalyzeStore", () => {
  beforeEach(() => {
    useAnalyzeStore.setState({ files: {} });
  });

  it("starts with empty files record", () => {
    expect(useAnalyzeStore.getState().files).toEqual({});
  });

  describe("setFileSettings", () => {
    it("sets contest type for a file", () => {
      useAnalyzeStore.getState().setFileSettings(1, { contestType: "startup" });
      expect(useAnalyzeStore.getState().files["1"]).toEqual({
        contestType: "startup",
      });
    });

    it("sets analysis scope for a file", () => {
      useAnalyzeStore
        .getState()
        .setFileSettings(2, { analysisScope: ["market", "risk"] });
      expect(useAnalyzeStore.getState().files["2"]).toEqual({
        analysisScope: ["market", "risk"],
      });
    });

    it("merges settings without overwriting existing ones", () => {
      const { setFileSettings } = useAnalyzeStore.getState();
      setFileSettings(1, { contestType: "startup" });
      setFileSettings(1, { analysisScope: ["market"] });

      expect(useAnalyzeStore.getState().files["1"]).toEqual({
        contestType: "startup",
        analysisScope: ["market"],
      });
    });

    it("overwrites a specific field when set again", () => {
      const { setFileSettings } = useAnalyzeStore.getState();
      setFileSettings(1, { contestType: "startup" });
      setFileSettings(1, { contestType: "enterprise" });

      expect(useAnalyzeStore.getState().files["1"]?.contestType).toBe(
        "enterprise",
      );
    });

    it("handles multiple files independently", () => {
      const { setFileSettings } = useAnalyzeStore.getState();
      setFileSettings(1, { contestType: "startup" });
      setFileSettings(2, { contestType: "enterprise" });

      expect(useAnalyzeStore.getState().files["1"]?.contestType).toBe(
        "startup",
      );
      expect(useAnalyzeStore.getState().files["2"]?.contestType).toBe(
        "enterprise",
      );
    });
  });

  describe("getFileSettings", () => {
    it("returns settings for an existing file", () => {
      useAnalyzeStore.getState().setFileSettings(1, { contestType: "startup" });
      expect(useAnalyzeStore.getState().getFileSettings(1)).toEqual({
        contestType: "startup",
      });
    });

    it("returns empty object for unknown file", () => {
      expect(useAnalyzeStore.getState().getFileSettings(999)).toEqual({});
    });
  });

  describe("resetFile", () => {
    it("removes the file entry from state", () => {
      useAnalyzeStore.getState().setFileSettings(1, { contestType: "startup" });
      useAnalyzeStore.getState().resetFile(1);

      expect(useAnalyzeStore.getState().files["1"]).toBeUndefined();
    });

    it("does not affect other files", () => {
      const { setFileSettings } = useAnalyzeStore.getState();
      setFileSettings(1, { contestType: "a" });
      setFileSettings(2, { contestType: "b" });

      useAnalyzeStore.getState().resetFile(1);

      expect(useAnalyzeStore.getState().files["1"]).toBeUndefined();
      expect(useAnalyzeStore.getState().files["2"]?.contestType).toBe("b");
    });

    it("is no-op for non-existent file", () => {
      useAnalyzeStore.getState().resetFile(999);
      expect(useAnalyzeStore.getState().files).toEqual({});
    });
  });
});
