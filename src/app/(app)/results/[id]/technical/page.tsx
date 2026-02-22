import TechnicalAnalysisView from "@/components/report/technical-view";
import { TechnicalAnalysisSchema } from "@/types/analysis-detail-result";
import { getTechnicalAnalysis } from "@/lib/get-result";
import { resultPage } from "../result-page-layout";

export default async function TechnicalAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return resultPage({
    params,
    fetcher: getTechnicalAnalysis,
    schema: TechnicalAnalysisSchema,
    View: TechnicalAnalysisView,
  });
}
