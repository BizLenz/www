import { SidebarInset } from "@/components/ui/sidebar";
import {
    AnalysisResultSchema,
    type AnalysisResult,
} from "@/types/analysis-result";

import RiskAnalysisView from "@/components/report/risk-view";
import {
    RiskAnalysisSchema,
    type RiskAnalysis,
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

// Dummy data for Risk Analysis
const riskAnalysisData = {
    title: "리스크 분석",
    risk_matrix: [
        {
            risk: "핵심 개발자 이탈",
            likelihood: "중간",
            impact: "높음",
            mitigation_strategy:
                "인력 유지를 위한 보상 체계 강화, 업무 분산 및 문서화, 백업 인력 확보 계획 수립",
        },
        {
            risk: "경쟁사 신규 서비스 출시",
            likelihood: "높음",
            impact: "중간",
            mitigation_strategy:
                "시장 모니터링 강화, 차별화된 기능 지속 개발, 빠른 업데이트 및 고객 피드백 반영",
        },
        {
            risk: "법적/규제 변경",
            likelihood: "낮음",
            impact: "높음",
            mitigation_strategy:
                "관련 법률 전문가 자문, 최신 규제 동향 주기적 검토 및 시스템 유연성 확보",
        },
        {
            risk: "서버 다운 및 데이터 손실",
            likelihood: "중간",
            impact: "높음",
            mitigation_strategy:
                "클라우드 다중화, 주기적인 백업 시스템 구축, 재해 복구 계획(DRP) 수립 및 테스트",
        },
    ],
};

export default async function RiskAnalysisPage({}: {
    params: { id: string };
}) {
    // const riskResult = await fetchRiskAnalysis(params.id);

    // validate data
    const parsedRiskAnalysis: RiskAnalysis =
        RiskAnalysisSchema.parse(riskAnalysisData);

    return (
        <SidebarInset>
            <RiskAnalysisView data={parsedRiskAnalysis} />
        </SidebarInset>
    );
}