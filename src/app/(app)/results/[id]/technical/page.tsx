import { SidebarInset } from "@/components/ui/sidebar";
import {
  AnalysisResultSchema,
  type AnalysisResult,
} from "@/types/analysis-result";

import TechnicalAnalysisView from "@/components/report/technical-view";
import {
  TechnicalAnalysisSchema,
  type TechnicalAnalysis,
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

// Dummy data for Technical Analysis
const technicalAnalysisData = {
  title: "기술 분석",
  technology_stack_assessment: {
    frontend: "React, Next.js, TypeScript, Tailwind CSS",
    backend: "Node.js (Express), NestJS, PostgreSQL",
    infra: "AWS EC2, RDS, S3, CloudFront, Docker, Kubernetes",
    evaluation:
      "최신 웹 기술 스택을 활용하여 개발 생산성과 유지보수성이 높습니다.\n마이크로서비스 아키텍처를 지향하여 향후 확장성이 뛰어납니다.\n클라우드 네이티브 환경에 최적화되어 있습니다.",
  },
  scalability:
    "수평적 확장이 용이한 MSA (Microservices Architecture) 기반으로 설계되었습니다. AWS의 오토스케일링 그룹 및 Kubernetes를 활용하여 트래픽 증가에 유연하게 대응할 수 있습니다. 데이터베이스 또한 Read Replica 등을 통해 확장성을 확보하고 있습니다.",
  security_risks: [
    "Cross-Site Scripting (XSS) 취약점",
    "SQL Injection 가능성 (백엔드 코드 리뷰 필요)",
    "민감 데이터 저장 시 암호화 부족",
    "API 키 노출 위험",
    "최신 CVE 보안 업데이트 지연",
  ],
};

export default async function TechnicalAnalysisPage({}: {
  params: { id: string };
}) {
  // const technicalResult = await fetchTechnicalAnalysis(params.id);

  // validate data
  const parsedTechnicalAnalysis: TechnicalAnalysis =
    TechnicalAnalysisSchema.parse(technicalAnalysisData);

  return (
    <SidebarInset>
      <TechnicalAnalysisView data={parsedTechnicalAnalysis} />
    </SidebarInset>
  );
}
