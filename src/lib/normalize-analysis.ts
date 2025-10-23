import type { AnalysisResult } from "@/types/analysis-result";

export function normalizeAnalysisResult(data: AnalysisResult) {
  const d = data.details;

  return {
    title: d.title,
    total_score: data.score,
    overall_assessment: data.summary,
    strengths: d.strengths,
    weaknesses: d.weaknesses,
    improvement_suggestions: d.improvement_suggestions,
    evaluation_criteria: d.evaluation_criteria.map((c) => ({
      category: c.category,
      score: c.score,
      max_score: c.max_score,
      min_score_required: c.min_score_required,
      is_passed: c.is_passed,
      sub_criteria: c.sub_criteria,
      reasoning: c.reasoning,
    })),
  };
}
