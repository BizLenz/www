import { z } from "zod";

export const AnalysisResultSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;