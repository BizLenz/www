import FinancialAnalysisView from "@/components/report/financial-view";
import { FinancialAnalysisSchema } from "@/types/analysis-detail-result";
import { getFinancialAnalysis } from "@/lib/get-result";
import { resultPage } from "../result-page-layout";

export default async function FinancialAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return resultPage({
    params,
    fetcher: getFinancialAnalysis,
    schema: FinancialAnalysisSchema,
    View: FinancialAnalysisView,
  });
}
