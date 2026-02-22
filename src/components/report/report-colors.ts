export type FeedbackVariant = "success" | "destructive" | "default";

export const feedbackVariantColors: Record<FeedbackVariant, string> = {
  success: "text-green-500",
  destructive: "text-red-500",
  default: "text-blue-500",
};

export type EvaluationCriterion = {
  category: string;
  score: number;
  max_score: number;
  min_score_required: number;
  is_passed: boolean;
  sub_criteria: Array<{ name: string; score: number }>;
  reasoning: string;
};
