import { SidebarInset } from "@/components/ui/sidebar";
import ReportView from "@/components/report/report-view";
import { getResult } from "@/lib/get-result";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const token = session?.session?.token;
  const result = await getResult(id, token);

  return (
    <SidebarInset>
      <ReportView result={result} />
    </SidebarInset>
  );
}
