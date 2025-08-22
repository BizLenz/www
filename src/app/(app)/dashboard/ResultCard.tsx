import type { AnalysisResult } from "@/types/entities";

export function ResultCard({ result }: { result: AnalysisResult }) {
  // details가 Zod로 파싱되어 오면 안전하게 렌더
  const d: any = result.details ?? {};
  return (
    <div className="rounded-2xl border p-4 space-y-2">
      <div className="text-sm uppercase tracking-wide text-muted-foreground">
        {result.evaluation_type}
      </div>
      <div className="text-lg font-semibold">{d.title ?? result.summary ?? 'Result'}</div>
      {Array.isArray(d.strengths) && d.strengths.length > 0 && (
        <div>
          <div className="text-sm font-medium">Strengths</div>
          <ul className="list-disc pl-5 text-sm">
            {d.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
      {/* 필요에 따라 weaknesses, evaluation_criteria 등 조건부 렌더 */}
    </div>
  );
}
