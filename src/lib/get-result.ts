import { normalizeAnalysisResult } from "@/lib/normalize-analysis";
import { serverFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import type { AnalysisResult } from "@/types/analysis-result";
import type {
  FinancialAnalysis,
  MarketAnalysis,
  RiskAnalysis,
  TechnicalAnalysis,
} from "@/types/analysis-detail-result";

const NO_CACHE: RequestInit = { cache: "no-store" };

export async function getResult(id: string, token: string | undefined) {
  const data = await serverFetch<AnalysisResult>(
    API_ENDPOINTS.evaluation.results(id),
    token,
    NO_CACHE,
  );
  return normalizeAnalysisResult(data);
}

export async function getFinancialAnalysis(
  id: string,
  token: string | undefined,
) {
  return serverFetch<FinancialAnalysis>(
    API_ENDPOINTS.evaluation.financial(id),
    token,
    NO_CACHE,
  );
}

export async function getMarketAnalysis(id: string, token: string | undefined) {
  return serverFetch<MarketAnalysis>(
    API_ENDPOINTS.evaluation.market(id),
    token,
    NO_CACHE,
  );
}

export async function getRiskAnalysis(id: string, token: string | undefined) {
  return serverFetch<RiskAnalysis>(
    API_ENDPOINTS.evaluation.risk(id),
    token,
    NO_CACHE,
  );
}

export async function getTechnicalAnalysis(
  id: string,
  token: string | undefined,
) {
  return serverFetch<TechnicalAnalysis>(
    API_ENDPOINTS.evaluation.technical(id),
    token,
    NO_CACHE,
  );
}
