import { SidebarInset } from "@/components/ui/sidebar";
import TechnicalAnalysisView from "@/components/report/technical-view";
import {
  TechnicalAnalysisSchema,
  type TechnicalAnalysis,
} from "@/types/analysis-detail-result";
import { getTechnicalAnalysis as getResult } from "@/lib/get-result";
import { auth } from "@/server/auth";

export default async function TechnicalAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const result = await getResult(id, session);

  // validate data
  const parsedTechnicalAnalysis: TechnicalAnalysis =
    TechnicalAnalysisSchema.parse(result);

  return (
    <SidebarInset>
      <TechnicalAnalysisView data={parsedTechnicalAnalysis} />
    </SidebarInset>
  );
}
