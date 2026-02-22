import RiskAnalysisView from "@/components/report/risk-view";
import { RiskAnalysisSchema } from "@/types/analysis-detail-result";
import { getRiskAnalysis } from "@/lib/get-result";
import { resultPage } from "../result-page-layout";

export default async function RiskAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return resultPage({
    params,
    fetcher: getRiskAnalysis,
    schema: RiskAnalysisSchema,
    View: RiskAnalysisView,
  });
}
