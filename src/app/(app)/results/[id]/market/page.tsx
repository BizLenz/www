import MarketAnalysisView from "@/components/report/market-view";
import { MarketAnalysisSchema } from "@/types/analysis-detail-result";
import { getMarketAnalysis } from "@/lib/get-result";
import { resultPage } from "../result-page-layout";

export default async function MarketAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return resultPage({
    params,
    fetcher: getMarketAnalysis,
    schema: MarketAnalysisSchema,
    View: MarketAnalysisView,
  });
}
