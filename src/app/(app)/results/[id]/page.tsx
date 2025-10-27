import { SidebarInset } from "@/components/ui/sidebar";
import ReportView from "@/components/report/report-view";
import { getResult } from "@/lib/get-result";

import { auth } from "@/server/auth";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const result = await getResult(id, session);

  return (
    <SidebarInset>
      <ReportView result={result} />
    </SidebarInset>
  );
}
