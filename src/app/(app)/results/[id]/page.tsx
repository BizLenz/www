import { SidebarInset } from "@/components/ui/sidebar";
import {
  AnalysisResultSchema,
  type AnalysisResult,
} from "@/types/analysis-result";
import ReportView from "@/components/report/report-view";

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

const json = {
  title: "예비창업패키지 사업계획서 최종 평가 보고서",
  total_score: 26.4,
  overall_assessment: "탈락 가능성 높음",
  strengths: [
    "기존 자기계발 서비스의 분산화 및 비효율성이라는 시장의 명확한 문제점을 인지하고 있습니다.",
    "이를 통합적이고 맞춤형, 커뮤니티 기반의 '올인원' 서비스로 해결하려는 차별화된 접근 방식을 제시했습니다.",
    "예상 결과물 이미지(UI/UX 목업)를 통해 서비스의 주요 기능을 시각적으로 이해할 수 있도록 제시한 점은 긍정적입니다.",
  ],
  weaknesses: [
    "문제 발견의 진정성 및 객관적 검증(시장 데이터, 사용자 인터뷰 등)이 현저히 부족합니다.",
    "핵심 기술 요소, 구현 방식, 개발 역량 등 기술 구현 계획이 심각하게 부재하여 기술적 실현 가능성이 불확실합니다.",
    "수익 모델, 가격 정책, 구체적인 자금 소요 및 조달 계획, 재정 리스크 관리 방안 등 사업의 재무적 계획이 전무합니다.",
    "시장 진입 및 고객 확보/유지 전략, 경쟁사 분석, 지적재산권 전략, 기술 적법성 및 규제 대응 방안이 매우 미흡합니다.",
    "대표자 및 팀원의 보유 역량, 역할 분담, 팀 운영 및 리스크 관리 방안에 대한 내용이 완전히 누락되어 있습니다.",
  ],
  improvement_suggestions: [
    "시장 및 고객 검증 강화: 잠재 고객 대상 설문조사, 인터뷰, MVP 테스트 등을 통해 문제의 보편성과 심각성을 객관적으로 검증하고, 시장 규모 및 성장률, 고객의 지불 의향 등 정량적 데이터를 확보해야 합니다.",
    "사업화 및 재무 계획 구체화: 핵심 기술 구현 계획(AI 적용 방안, 아키텍처 등), 구체적인 수익 모델(가격 정책 포함), 자금 소요 및 조달 계획, 재정 리스크 관리 방안을 상세히 제시하여 사업의 실현 가능성과 지속 가능성을 입증해야 합니다.",
    "팀 역량 및 운영 계획 명확화: 각 팀원의 핵심 역량, 담당 업무, 관련 경험을 구체적으로 기술하고, 팀 운영 방식, 의사소통 체계, 외부 협력 계획, 그리고 팀 관련 리스크 관리 방안을 명확하게 제시해야 합니다.",
  ],
  evaluation_criteria: [
    {
      category: "문제인식",
      score: 16.0,
      max_score: 30,
      min_score_required: 18,
      is_passed: false,
      sub_criteria: [
        {
          name: "1.1. 창업아이템의 개발동기",
          score: 6.5,
        },
        {
          name: "1.2. 창업아이템의 목적(필요성) (Purpose and Necessity of the Startup Item)",
          score: 9.5,
        },
      ],
      reasoning:
        "기존 자기계발 서비스의 문제점을 명확히 인지하고 차별화된 해결 방안을 제시한 점은 긍정적이나, 문제 발견의 진정성과 객관적 검증(시장 데이터, 사용자 인터뷰 등)이 현저히 부족하여 최소 득점 기준을 충족하지 못했습니다.",
    },
    {
      category: "해결방안",
      score: 9.5,
      max_score: 30,
      min_score_required: 18,
      is_passed: false,
      sub_criteria: [
        {
          name: "2.1. 창업아이템의 사업화 전략 (Commercialization Strategy for the Startup Item)",
          score: 4.5,
        },
        {
          name: "2.2. 시장분석 및 경쟁력 확보방안 (Market Analysis and Competitiveness Strategy)",
          score: 5.0,
        },
      ],
      reasoning:
        "기존 시장의 문제점을 해결하려는 아이템의 방향성은 명확하나, 핵심 기술 구현 계획, 구체적인 사용자 검증 전략, 수익 모델, 경쟁사 분석 및 지적재산권 전략, 기술 적법성 분석 등 사업화의 핵심 요소들이 심각하게 결여되어 최소 득점 기준에 미달했습니다.",
    },
    {
      category: "성장전략",
      score: 0.9,
      max_score: 20,
      min_score_required: 12,
      is_passed: false,
      sub_criteria: [
        {
          name: "3.1. 자금소요 및 조달계획 (Funding Requirements and Procurement Plan)",
          score: 0.0,
        },
        {
          name: "3.2. 시장진입 및 성과창출 전략 (Market Entry and Performance Generation Strategy)",
          score: 0.9,
        },
      ],
      reasoning:
        "사업의 지속 가능성을 담보할 수익 모델, 구체적인 자금 소요 및 조달 계획, 시장 진입 및 고객 확보 전략, 재정 및 사업 리스크 관리 방안 등 재무 및 성장 전략에 대한 내용이 거의 전무하여 최소 득점 기준을 크게 하회했습니다.",
    },
    {
      category: "팀 구성",
      score: 0.0,
      max_score: 20,
      min_score_required: 12,
      is_passed: false,
      sub_criteria: [
        {
          name: "4.1. 대표자 및 팀원의 보유역량 (Capabilities of the Founder and Team Members)",
          score: 0.0,
        },
      ],
      reasoning:
        "대표자 및 팀원의 보유 역량, 역할 분담, 팀 운영 및 의사소통 체계, 외부 역량 활용 및 팀 관련 리스크 관리 방안에 대한 내용이 완전히 누락되어 사업 추진 주체의 역량과 안정성을 전혀 파악할 수 없어 최소 득점 기준을 충족하지 못했습니다.",
    },
  ],
};

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getResult(params.id);

  return (
    <SidebarInset>
      <ReportView result={json} />
    </SidebarInset>
  );
}
