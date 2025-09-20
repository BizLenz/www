import { SidebarInset } from "@/components/ui/sidebar";
import {
    AnalysisResultSchema,
    type AnalysisResult,
} from "@/types/analysis-result";

import FinancialAnalysisView from "@/components/report/financial-view"; // Import the new component
import {
    FinancialAnalysisSchema,
    type FinancialAnalysis,
} from "@/types/analysis-detail-result";

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

const financialAnalysisData = {
    title: "재무 분석",
    revenue_projections: [
        {
            year: 1,
            revenue: "1억원",
            assumptions: "신규 고객 유치 및 서비스 안정화",
        },
        {
            year: 2,
            revenue: "3억원",
            assumptions: "시장 점유율 확대 및 기능 개선",
        },
        {
            year: 3,
            revenue: "7억원",
            assumptions: "글로벌 시장 진출 및 신규 서비스 출시",
        },
    ],
    cost_analysis: {
        initial_investment: "5천만원",
        monthly_fixed_cost: "1천만원",
        variable_cost_per_use: "100원",
    },
    break_even_point: "서비스 출시 후 12개월 내 달성 목표",
    funding_recommendation:
        "초기 Seed 투자 유치 (1억원) 권고. 추가적으로 정부 지원 사업 활용 검토.",
};

export default async function FinancialAnalysisPage({}: {
    params: { id: string };
}) {
    // const financialResult = await fetchFinancialAnalysis(params.id);

    // validate data
    const parsedFinancialAnalysis: FinancialAnalysis =
        FinancialAnalysisSchema.parse(financialAnalysisData);

    return (
        <SidebarInset>
            <FinancialAnalysisView data={parsedFinancialAnalysis} />
        </SidebarInset>
    );
}