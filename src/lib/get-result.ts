import { normalizeAnalysisResult } from "@/lib/normalize-analysis";
import { serverFetch } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/config/api";
import type { Session } from "next-auth";
import type { AnalysisResult } from "@/types/analysis-result";
import type {
  FinancialAnalysis,
  MarketAnalysis,
  RiskAnalysis,
  TechnicalAnalysis,
} from "@/types/analysis-detail-result";

export async function getResult(id: string, session: Session | null) {
  const data = await serverFetch<AnalysisResult>(
    API_ENDPOINTS.evaluation.results(id),
    session?.accessToken,
    { cache: "no-store" },
  );
  return normalizeAnalysisResult(data);
}

export async function getFinancialAnalysis(
  id: string,
  session: Session | null,
) {
  return serverFetch<FinancialAnalysis>(
    API_ENDPOINTS.evaluation.financial(id),
    session?.accessToken,
    { cache: "no-store" },
  );
}

export async function getMarketAnalysis(id: string, session: Session | null) {
  return serverFetch<MarketAnalysis>(
    API_ENDPOINTS.evaluation.market(id),
    session?.accessToken,
    { cache: "no-store" },
  );
}

export async function getRiskAnalysis(id: string, session: Session | null) {
  return serverFetch<RiskAnalysis>(
    API_ENDPOINTS.evaluation.risk(id),
    session?.accessToken,
    { cache: "no-store" },
  );
}

export async function getTechnicalAnalysis(
  id: string,
  session: Session | null,
) {
  return serverFetch<TechnicalAnalysis>(
    API_ENDPOINTS.evaluation.technical(id),
    session?.accessToken,
    { cache: "no-store" },
  );
}
