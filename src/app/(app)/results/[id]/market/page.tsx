import { SidebarInset } from "@/components/ui/sidebar";
import MarketAnalysisView from "@/components/report/market-view";
import {
  MarketAnalysisSchema,
  type MarketAnalysis,
} from "@/types/analysis-detail-result";
import { getMarketAnalysis as getResult } from "@/lib/get-result";
import { auth } from "@/server/auth";

export default async function MarketAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const result = await getResult(id, session);

  // validate data
  const parsedMarketAnalysis: MarketAnalysis =
    MarketAnalysisSchema.parse(result);

  return (
    <SidebarInset>
      <MarketAnalysisView data={parsedMarketAnalysis} />
    </SidebarInset>
  );
}
