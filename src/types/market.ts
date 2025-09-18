import { z } from "zod";

export const MarketAnalysisSchema = z.object({
  title: z.string(),
  target_audience: z.string(),
  market_size: z.object({
    tam: z.string(),
    sam: z.string(),
    som: z.string(),
  }),
  competitor_analysis: z.array(
    z.object({
      competitor: z.string(),
      strengths: z.array(z.string()),
      weaknesses: z.array(z.string()),
    }),
  ),
  market_trends: z.array(z.string()),
});

export type MarketAnalysis = z.infer<typeof MarketAnalysisSchema>;
