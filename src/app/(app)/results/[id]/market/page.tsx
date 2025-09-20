import { SidebarInset } from "@/components/ui/sidebar";
import {
  AnalysisResultSchema,
  type AnalysisResult,
} from "@/types/analysis-result";

import MarketAnalysisView from "@/components/report/market-view";
import {
  MarketAnalysisSchema,
  type MarketAnalysis,
} from "@/types/analysis-detail-result";

// TODO: fetch result from server
async function getResult(id: string): Promise<AnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const dummyData: AnalysisResult = {
    id,
    fileName: `example-file-${id}.txt`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    updatedAt: new Date().toISOString(),
    evaluations: [
      {
        evaluationType: "market",
        evaluationCategory: "growth_potential",
        score: 85.5,
        grade: "A",
        title: "시장 성장성 평가",
        summary: "향후 5년간 높은 성장세 예상",
        detailedFeedback: "경쟁사 대비 기술 우위가 뚜렷함",
        strengths: ["기술 경쟁력", "시장 점유율 상승", "브랜드 인지도"],
        weaknesses: ["마케팅 예산 부족", "신규 시장 진입 장벽"],
        recommendations: ["마케팅 투자 확대", "파트너십 강화"],
        evaluationCriteria: { criteria1: "시장 규모", criteria2: "성장률" },
        metrics: { CAGR: 12.5, MarketShare: 15 },
        benchmarkData: { industryAverage: 10 },
        weight: 0.25,
        importanceLevel: "high",
        status: "completed",
        confidenceScore: 92.3,
        evaluatorType: "human",
        evaluatorInfo: { name: "홍길동", role: "시장 분석가" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evaluatedAt: new Date().toISOString(),
        version: 1,
        parentEvaluationId: null,
      },
      {
        evaluationType: "financial",
        evaluationCategory: "profitability",
        score: 72.3,
        grade: "B+",
        title: "재무 안정성 평가",
        summary: "수익성은 양호하나 부채 비율이 다소 높음",
        detailedFeedback: "영업이익률은 업계 평균 이상",
        strengths: ["영업이익률 우수", "현금 흐름 안정"],
        weaknesses: ["부채 비율 높음"],
        recommendations: ["부채 상환 계획 수립"],
        evaluationCriteria: { criteria1: "ROE", criteria2: "Debt Ratio" },
        metrics: { ROE: 15, DebtRatio: 65 },
        benchmarkData: { industryAverage: 50 },
        weight: 0.2,
        importanceLevel: "medium",
        status: "completed",
        confidenceScore: 88.1,
        evaluatorType: "ai",
        evaluatorInfo: { model: "GPT-5" },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        evaluatedAt: new Date().toISOString(),
        version: 1,
        parentEvaluationId: null,
      },
    ],
  };

  return AnalysisResultSchema.parse(dummyData);
}

const marketAnalysisData = {
  title: "시장성 분석",
  target_audience: "20-30대 IT 기술에 관심이 많은 직장인 및 학생",
  market_size: {
    tam: "1조원",
    sam: "3000억원",
    som: "초기 3년 내 100억원 목표",
  },
  competitor_analysis: [
    {
      competitor: "A사",
      strengths: ["높은 브랜드 인지도", "기존 고객층 확보"],
      weaknesses: ["높은 가격", "기술 업데이트 속도 느림"],
    },
    {
      competitor: "B사",
      strengths: ["저렴한 가격"],
      weaknesses: ["기술적 안정성 부족", "제한적인 기능"],
    },
  ],
  market_trends: ["AI 기반 개인화 서비스 확대", "구독 경제 모델의 보편화"],
};

export default async function MarketAnalysisPage({}: {
  params: { id: string };
}) {
  // const result = await getResult(params.id);

  // validate data
  const parsedMarketAnalysis: MarketAnalysis =
    MarketAnalysisSchema.parse(marketAnalysisData);

  return (
    <SidebarInset>
      <MarketAnalysisView data={parsedMarketAnalysis} />
    </SidebarInset>
  );
}
