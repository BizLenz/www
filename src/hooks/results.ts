import { api } from "@/lib/api";
import type { AnalysisResult } from "@/types/entities";
import { parseDetails } from "@/lib/contracts";

export async function fetchResults(jobId: number): Promise<AnalysisResult[]> {
  const results = await api<{ data: AnalysisResult[] }>(`/api/jobs/${jobId}/results`).then(r => r.data);
  // details 런타임 검증
  return results.map(r => {
    if (r.details) {
      const parsed = parseDetails(r.evaluation_type, r.details);
      if (parsed.success) r.details = parsed.data;
      // 실패 시 원본 유지 or null 처리 (팀 컨벤션에 맞춰 선택)
    }
    return r;
  });
}
