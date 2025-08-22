import { z } from "zod";
import { DetailsByType } from "@/types/schemas";

// 공통 페이로드/응답 계약(필요한 것만 예시)
export const CreatePlanReq = z.object({
  userId: z.number(),
  fileName: z.string(),
  filePath: z.string(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
});
export type CreatePlanReq = z.infer<typeof CreatePlanReq>;

export const CreateJobReq = z.object({
  planId: z.number(),
  jobType: z.enum(['basic','market','financial','technical','risk']),
});
export type CreateJobReq = z.infer<typeof CreateJobReq>;

// details 파싱 유틸
export function parseDetails(evaluation_type: string, details: unknown) {
  const schema = DetailsByType[evaluation_type] ?? DetailsByType['overall'];
  return schema.safeParse(details);
}
