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

export const FinancialAnalysisSchema = z.object({
  title: z.string(),
  revenue_projections: z.array(
    z.object({
      year: z.number(),
      revenue: z.string(),
      assumptions: z.string(),
    }),
  ),
  cost_analysis: z.object({
    initial_investment: z.string(),
    monthly_fixed_cost: z.string(),
    variable_cost_per_use: z.string(),
  }),
  break_even_point: z.string(),
  funding_recommendation: z.string(),
});

export const TechnicalAnalysisSchema = z.object({
  title: z.string(),
  technology_stack_assessment: z.object({
    frontend: z.string(),
    backend: z.string(),
    infra: z.string(),
    evaluation: z.string(),
  }),
  scalability: z.string(),
  security_risks: z.array(z.string()),
});

export const RiskAnalysisSchema = z.object({
  title: z.string(),
  risk_matrix: z.array(
    z.object({
      risk: z.string(),
      likelihood: z.string(),
      impact: z.string(),
      mitigation_strategy: z.string(),
    }),
  ),
});

export type MarketAnalysis = z.infer<typeof MarketAnalysisSchema>;
export type FinancialAnalysis = z.infer<typeof FinancialAnalysisSchema>;
export type TechnicalAnalysis = z.infer<typeof TechnicalAnalysisSchema>;
export type RiskAnalysis = z.infer<typeof RiskAnalysisSchema>;
