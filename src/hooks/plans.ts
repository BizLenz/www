import { api } from "@/lib/api";
import type { BusinessPlan, ID } from "@/types/entities";
import { CreatePlanReq } from "@/lib/contracts";

// GET /api/plans?userId=...
export async function fetchPlansByUser(userId: ID): Promise<BusinessPlan[]> {
  return api<{ data: BusinessPlan[] }>(`/api/plans?userId=${userId}`).then(r => r.data);
}

export async function createPlan(payload: CreatePlanReq): Promise<BusinessPlan> {
  const body = CreatePlanReq.parse(payload);
  return api<{ data: BusinessPlan }>(`/api/plans`, {
    method: 'POST',
    body: JSON.stringify(body),
  }).then(r => r.data);
}
