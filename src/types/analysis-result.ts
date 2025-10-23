import { z } from "zod";

export const SubCriterionSchema = z.object({
  name: z.string(),
  score: z.number(),
});

export const EvaluationCriterionSchema = z.object({
  category: z.string(),
  score: z.number(),
  max_score: z.number(),
  min_score_required: z.number(),
  is_passed: z.boolean(),
  sub_criteria: z.array(SubCriterionSchema),
  reasoning: z.string(),
});

export const AnalysisDetailsSchema = z.object({
  title: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvement_suggestions: z.array(z.string()),
  evaluation_criteria: z.array(EvaluationCriterionSchema),
});

export const AnalysisResultSchema = z.object({
  id: z.number(),
  analysis_job_id: z.number(),
  evaluation_type: z.string(),
  score: z.number(),
  summary: z.string(),
  details: AnalysisDetailsSchema,
  created_at: z.string(),
});

export type SubCriterion = z.infer<typeof SubCriterionSchema>;
export type EvaluationCriterion = z.infer<typeof EvaluationCriterionSchema>;
export type AnalysisDetails = z.infer<typeof AnalysisDetailsSchema>;
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
