import { normalizeAnalysisResult } from "@/lib/normalize-analysis";
import type { Session } from "next-auth";
import type { AnalysisResult } from "@/types/analysis-result";
import type {
  FinancialAnalysis,
  MarketAnalysis,
  RiskAnalysis,
  TechnicalAnalysis,
} from "@/types/analysis-detail-result";

export async function getResult(id: string, session: Session | null) {
  if (!session) {
    throw new Error("Session not found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluation/results/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      // optional headers / cache policy
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch result");
  const data = (await res.json()) as AnalysisResult;
  return normalizeAnalysisResult(data);
}

export async function getFinancialAnalysis(
  id: string,
  session: Session | null,
) {
  if (!session) {
    throw new Error("Session not found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluation/results/financial/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      // optional headers / cache policy
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch result");
  return (await res.json()) as FinancialAnalysis;
}

export async function getMarketAnalysis(id: string, session: Session | null) {
  if (!session) {
    throw new Error("Session not found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluation/results/market/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      // optional headers / cache policy
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch result");
  return (await res.json()) as MarketAnalysis;
}

export async function getRiskAnalysis(id: string, session: Session | null) {
  if (!session) {
    throw new Error("Session not found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluation/results/risk/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      // optional headers / cache policy
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch result");
  return (await res.json()) as RiskAnalysis;
}

export async function getTechnicalAnalysis(
  id: string,
  session: Session | null,
) {
  if (!session) {
    throw new Error("Session not found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluation/results/technical/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      // optional headers / cache policy
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch result");
  return (await res.json()) as TechnicalAnalysis;
}
