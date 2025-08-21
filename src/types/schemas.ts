import { z } from "zod";

export const DetailsCommon = z.object({
  title: z.string(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  improvement_suggestions: z.array(z.string()).optional(),
});

export const DetailsOverall = DetailsCommon.extend({
  evaluation_criteria: z.array(z.object({
    criterion: z.string(),
    score: z.number(),       
    reasoning: z.string(),
  })).optional(),
});

export const DetailsMarket = DetailsCommon.extend({
  target_audience: z.string().optional(),
  market_size: z.object({
    tam: z.string().optional(),
    sam: z.string().optional(),
    som: z.string().optional(),
  }).partial().optional(),
  competitor_analysis: z.array(z.object({
    competitor: z.string(),
    strengths: z.array(z.string()).optional(),
    weaknesses: z.array(z.string()).optional(),
  })).optional(),
  market_trends: z.array(z.string()).optional(),
});

export const DetailsFinancial = DetailsCommon.extend({
  revenue_projections: z.array(z.object({
    year: z.number(),
    revenue: z.string(),
    assumptions: z.string().optional(),
  })).optional(),
  cost_analysis: z.object({
    initial_investment: z.string().optional(),
    monthly_fixed_cost: z.string().optional(),
    variable_cost_per_user: z.string().optional(),
  }).partial().optional(),
  break_even_point: z.string().optional(),
  funding_recommendation: z.string().optional(),
});

export const DetailsTechnical = DetailsCommon.extend({
  technology_stack_assessment: z.object({
    frontend: z.string().optional(),
    backend: z.string().optional(),
    infra: z.string().optional(),
    evaluation: z.string().optional(),
  }).partial().optional(),
  scalability: z.string().optional(),
  security_risks: z.array(z.string()).optional(),
});

export const DetailsRisk = DetailsCommon.extend({
  risk_matrix: z.array(z.object({
    risk_description: z.string(),
    likelihood: z.enum(['Low','Medium','High']),
    impact: z.enum(['Low','Medium','High']),
    mitigation_strategy: z.string(),
  })).optional(),
});

export const DetailsByType: Record<string, typeof DetailsCommon> = {
  overall: DetailsOverall,
  market: DetailsMarket,
  financial: DetailsFinancial,
  technical: DetailsTechnical,
  risk: DetailsRisk,
};
