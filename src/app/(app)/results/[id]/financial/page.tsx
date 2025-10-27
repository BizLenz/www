import { SidebarInset } from "@/components/ui/sidebar";
import FinancialAnalysisView from "@/components/report/financial-view";
import {
  FinancialAnalysisSchema,
  type FinancialAnalysis,
} from "@/types/analysis-detail-result";
import { getFinancialAnalysis as getResult } from "@/lib/get-result";
import { auth } from "@/server/auth";

export default async function FinancialAnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const result = await getResult(id, session);

  const parsedFinancialAnalysis: FinancialAnalysis =
    FinancialAnalysisSchema.parse(result);

  return (
    <SidebarInset>
      <FinancialAnalysisView data={parsedFinancialAnalysis} />
    </SidebarInset>
  );
}
