import { describe, it, expect, beforeEach, mock } from "bun:test";
import type { AnalysisResult } from "@/types/analysis-result";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockServerFetch = mock<(...args: any[]) => Promise<any>>();

void mock.module("@/lib/api-client", () => ({
  serverFetch: mockServerFetch,
  authenticatedFetch: mock(),
}));

const {
  getResult,
  getFinancialAnalysis,
  getMarketAnalysis,
  getRiskAnalysis,
  getTechnicalAnalysis,
} = await import("./get-result");

function makeAnalysisResult(): AnalysisResult {
  return {
    id: 1,
    analysis_job_id: 10,
    evaluation_type: "general",
    score: 85,
    summary: "Good overall",
    details: {
      title: "Report",
      strengths: ["A"],
      weaknesses: ["B"],
      improvement_suggestions: ["C"],
      evaluation_criteria: [
        {
          category: "Innovation",
          score: 9,
          max_score: 10,
          min_score_required: 5,
          is_passed: true,
          sub_criteria: [{ name: "Novelty", score: 9 }],
          reasoning: "Good",
        },
      ],
    },
    created_at: "2026-01-01T00:00:00Z",
  };
}

describe("getResult", () => {
  beforeEach(() => {
    mockServerFetch.mockReset();
  });

  it("returns normalized analysis result", async () => {
    mockServerFetch.mockResolvedValueOnce(makeAnalysisResult());

    const result = await getResult("123", "test-token");

    expect(result.title).toBe("Report");
    expect(result.total_score).toBe(85);
    expect(result.overall_assessment).toBe("Good overall");
    expect(result.evaluation_criteria).toHaveLength(1);
  });

  it("passes access token to serverFetch", async () => {
    mockServerFetch.mockResolvedValueOnce(makeAnalysisResult());

    await getResult("123", "test-token");

    expect(mockServerFetch.mock.calls[0]![1]).toBe("test-token");
  });

  it("passes undefined token when token is undefined", async () => {
    mockServerFetch.mockResolvedValueOnce(makeAnalysisResult());

    await getResult("123", undefined).catch(() => {
      /* expected */
    });

    expect(mockServerFetch.mock.calls[0]![1]).toBeUndefined();
  });

  it("passes cache: no-store option", async () => {
    mockServerFetch.mockResolvedValueOnce(makeAnalysisResult());

    await getResult("123", "test-token");

    const options = mockServerFetch.mock.calls[0]![2] as RequestInit;
    expect(options.cache).toBe("no-store");
  });

  it("propagates serverFetch errors", async () => {
    mockServerFetch.mockRejectedValueOnce(new Error("Not found"));

    expect(getResult("999", "test-token")).rejects.toThrow("Not found");
  });
});

describe("getFinancialAnalysis", () => {
  beforeEach(() => {
    mockServerFetch.mockReset();
  });

  it("returns financial analysis data", async () => {
    const financial = { title: "Financial", break_even_point: "18 months" };
    mockServerFetch.mockResolvedValueOnce(financial);

    const result = await getFinancialAnalysis("123", "test-token");

    expect(result.title).toBe("Financial");
  });

  it("passes the correct endpoint URL", async () => {
    mockServerFetch.mockResolvedValueOnce({});

    await getFinancialAnalysis("42", "test-token");

    const url = mockServerFetch.mock.calls[0]![0] as string;
    expect(url).toContain("evaluation/results/financial/42");
  });
});

describe("getMarketAnalysis", () => {
  beforeEach(() => {
    mockServerFetch.mockReset();
  });

  it("returns market analysis data", async () => {
    const market = { title: "Market", target_audience: "SMBs" };
    mockServerFetch.mockResolvedValueOnce(market);

    const result = await getMarketAnalysis("123", "test-token");

    expect(result.title).toBe("Market");
  });

  it("passes the correct endpoint URL", async () => {
    mockServerFetch.mockResolvedValueOnce({});

    await getMarketAnalysis("42", "test-token");

    const url = mockServerFetch.mock.calls[0]![0] as string;
    expect(url).toContain("evaluation/results/market/42");
  });
});

describe("getRiskAnalysis", () => {
  beforeEach(() => {
    mockServerFetch.mockReset();
  });

  it("returns risk analysis data", async () => {
    const risk = { title: "Risk", risk_matrix: [] };
    mockServerFetch.mockResolvedValueOnce(risk);

    const result = await getRiskAnalysis("123", "test-token");

    expect(result.title).toBe("Risk");
  });

  it("passes the correct endpoint URL", async () => {
    mockServerFetch.mockResolvedValueOnce({});

    await getRiskAnalysis("42", "test-token");

    const url = mockServerFetch.mock.calls[0]![0] as string;
    expect(url).toContain("evaluation/results/risk/42");
  });
});

describe("getTechnicalAnalysis", () => {
  beforeEach(() => {
    mockServerFetch.mockReset();
  });

  it("returns technical analysis data", async () => {
    const tech = { title: "Tech", scalability: "High" };
    mockServerFetch.mockResolvedValueOnce(tech);

    const result = await getTechnicalAnalysis("123", "test-token");

    expect(result.title).toBe("Tech");
  });

  it("passes the correct endpoint URL", async () => {
    mockServerFetch.mockResolvedValueOnce({});

    await getTechnicalAnalysis("42", "test-token");

    const url = mockServerFetch.mock.calls[0]![0] as string;
    expect(url).toContain("evaluation/results/technical/42");
  });

  it("propagates errors", async () => {
    mockServerFetch.mockRejectedValueOnce(
      new Error("Request failed with status 500"),
    );

    expect(getTechnicalAnalysis("42", "test-token")).rejects.toThrow(
      "Request failed with status 500",
    );
  });
});
