import { api } from "@/lib/api";
import type { AnalysisJob } from "@/types/entities";
import { CreateJobReq } from "@/lib/contracts";

export async function createJob(payload: CreateJobReq): Promise<AnalysisJob> {
  const body = CreateJobReq.parse(payload);
  return api<{ data: AnalysisJob }>(`/api/jobs`, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then(r => r.data);
}
