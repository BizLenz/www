// TODO: fetch from backend after DB gets fixed

"use client";

import { type AnalysisResult } from "@/types/analysis-result";
import {
  ScoreChart,
  FeedbackCard,
  EvaluationCriteriaCard,
} from "@/components/report/report-components";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lightbulb, ThumbsDown, ThumbsUp } from "lucide-react";

// --- MOCK DATA TYPE ---
type MockAnalysisResult = {
  title: string;
  total_score: number;
  overall_assessment: string;
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  evaluation_criteria: Array<{
    category: string;
    score: number;
    max_score: number;
    min_score_required: number;
    is_passed: boolean;
    sub_criteria: Array<{ name: string; score: number }>;
    reasoning: string;
  }>;
};

export default function ReportView({ result }: { result: MockAnalysisResult }) {
  const {
    title,
    total_score,
    overall_assessment,
    strengths,
    weaknesses,
    improvement_suggestions,
    evaluation_criteria,
  } = result;

  const isFailing = overall_assessment.includes("탈락");

  return (
    <div className="bg-background text-foreground min-h-screen p-4 font-sans sm:p-6 md:p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <Card className="flex-grow p-4 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                종합 점수
              </p>
              <p
                className={cn(
                  "text-4xl font-bold",
                  isFailing ? "text-destructive" : "text-green-500",
                )}
              >
                {total_score.toFixed(1)}
                <span className="text-muted-foreground text-lg font-medium">
                  / 100
                </span>
              </p>
            </Card>
            <Card className="flex-grow p-4 text-center">
              <p className="text-muted-foreground text-sm font-medium">
                종합 평가
              </p>
              <p
                className={cn(
                  "text-2xl font-bold",
                  isFailing ? "text-destructive" : "text-green-500",
                )}
              >
                {overall_assessment}
              </p>
            </Card>
          </div>
        </header>

        <main className="space-y-8">
          <ScoreChart data={evaluation_criteria} />

          <div className="grid gap-6 md:grid-cols-3">
            <FeedbackCard
              title="강점 (Strengths)"
              items={strengths}
              icon={ThumbsUp}
              variant="success"
            />
            <FeedbackCard
              title="보완점 (Weaknesses)"
              items={weaknesses}
              icon={ThumbsDown}
              variant="destructive"
            />
            <FeedbackCard
              title="개선 제안 (Suggestions)"
              items={improvement_suggestions}
              icon={Lightbulb}
              variant="default"
            />
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">세부 평가 결과</h2>
            <div className="space-y-4">
              {evaluation_criteria.map((criterion) => (
                <EvaluationCriteriaCard
                  key={criterion.category}
                  criterion={criterion}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
