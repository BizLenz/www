import { SidebarInset } from "@/components/ui/sidebar";
import RiskAnalysisView from "@/components/report/risk-view";
import {
  RiskAnalysisSchema,
  type RiskAnalysis,
} from "@/types/analysis-detail-result";
import { getRiskAnalysis as getResult } from "@/lib/get-result";
import { auth } from "@/server/auth";

export default async function RiskAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const result = await getResult(id, session);

  // validate data
  const parsedRiskAnalysis: RiskAnalysis = RiskAnalysisSchema.parse(result);

  return (
    <SidebarInset>
      <RiskAnalysisView data={parsedRiskAnalysis} />
    </SidebarInset>
  );
}
