import { z } from "zod";

export const AnalysisResultSchema = z.object({
    id: z.string(),
    fileName: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    evaluations: z.array(
        z.object({
            evaluationType: z.string(), // overall, market, financial, technical, risk
            evaluationCategory: z.string(),
            score: z.number().min(0).max(100),
            grade: z.string(),
            title: z.string(),
            summary: z.string().nullable(),
            detailedFeedback: z.string().nullable(),
            strengths: z.array(z.string()).optional(),
            weaknesses: z.array(z.string()).optional(),
            recommendations: z.array(z.string()).optional(),
            evaluationCriteria: z.record(z.any()).optional(),
            metrics: z.record(z.any()).optional(),
            benchmarkData: z.record(z.any()).optional(),
            weight: z.number().min(0).max(1).optional(),
            importanceLevel: z.string(),
            status: z.string(),
            confidenceScore: z.number().min(0).max(100).optional(),
            evaluatorType: z.string(),
            evaluatorInfo: z.record(z.any()).optional(),
            createdAt: z.string(),
            updatedAt: z.string(),
            evaluatedAt: z.string().nullable(),
            version: z.number(),
            parentEvaluationId: z.number().nullable(),
        })
    ),
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;