import { describe, it, expect } from "bun:test";
import { normalizeAnalysisResult } from "./normalize-analysis";
import type { AnalysisResult } from "@/types/analysis-result";

function makeResult(overrides?: Partial<AnalysisResult>): AnalysisResult {
  return {
    id: 1,
    analysis_job_id: 10,
    evaluation_type: "general",
    score: 85,
    summary: "Good overall",
    details: {
      title: "Test Report",
      strengths: ["Strong team"],
      weaknesses: ["Limited funding"],
      improvement_suggestions: ["Seek investors"],
      evaluation_criteria: [
        {
          category: "Innovation",
          score: 9,
          max_score: 10,
          min_score_required: 5,
          is_passed: true,
          sub_criteria: [{ name: "Novelty", score: 9 }],
          reasoning: "Very innovative approach",
        },
      ],
    },
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("normalizeAnalysisResult", () => {
  it("maps title from details", () => {
    const result = normalizeAnalysisResult(makeResult());
    expect(result.title).toBe("Test Report");
  });

  it("maps total_score from top-level score", () => {
    const result = normalizeAnalysisResult(makeResult({ score: 72 }));
    expect(result.total_score).toBe(72);
  });

  it("maps overall_assessment from summary", () => {
    const result = normalizeAnalysisResult(makeResult({ summary: "Great" }));
    expect(result.overall_assessment).toBe("Great");
  });

  it("passes through strengths array", () => {
    const result = normalizeAnalysisResult(makeResult());
    expect(result.strengths).toEqual(["Strong team"]);
  });

  it("passes through weaknesses array", () => {
    const result = normalizeAnalysisResult(makeResult());
    expect(result.weaknesses).toEqual(["Limited funding"]);
  });

  it("passes through improvement_suggestions", () => {
    const result = normalizeAnalysisResult(makeResult());
    expect(result.improvement_suggestions).toEqual(["Seek investors"]);
  });

  it("maps evaluation_criteria fields correctly", () => {
    const result = normalizeAnalysisResult(makeResult());
    const criterion = result.evaluation_criteria[0]!;

    expect(criterion.category).toBe("Innovation");
    expect(criterion.score).toBe(9);
    expect(criterion.max_score).toBe(10);
    expect(criterion.min_score_required).toBe(5);
    expect(criterion.is_passed).toBe(true);
    expect(criterion.sub_criteria).toEqual([{ name: "Novelty", score: 9 }]);
    expect(criterion.reasoning).toBe("Very innovative approach");
  });

  it("handles multiple evaluation criteria", () => {
    const data = makeResult();
    data.details.evaluation_criteria.push({
      category: "Feasibility",
      score: 7,
      max_score: 10,
      min_score_required: 6,
      is_passed: true,
      sub_criteria: [],
      reasoning: "Feasible plan",
    });

    const result = normalizeAnalysisResult(data);
    expect(result.evaluation_criteria).toHaveLength(2);
    expect(result.evaluation_criteria[1]!.category).toBe("Feasibility");
  });

  it("handles empty arrays in details", () => {
    const data = makeResult();
    data.details.strengths = [];
    data.details.weaknesses = [];
    data.details.improvement_suggestions = [];
    data.details.evaluation_criteria = [];

    const result = normalizeAnalysisResult(data);
    expect(result.strengths).toEqual([]);
    expect(result.weaknesses).toEqual([]);
    expect(result.improvement_suggestions).toEqual([]);
    expect(result.evaluation_criteria).toEqual([]);
  });
});
