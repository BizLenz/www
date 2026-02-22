import type { Session } from "next-auth";
import type { ZodSchema } from "zod";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";

export async function resultPage<TRaw, TParsed>({
  params,
  fetcher,
  schema,
  View,
}: {
  params: Promise<{ id: string }>;
  fetcher: (id: string, session: Session | null) => Promise<TRaw>;
  schema: ZodSchema<TParsed>;
  View: React.ComponentType<{ data: TParsed }>;
}) {
  const { id } = await params;
  const session = await auth();
  const raw = await fetcher(id, session);
  const data = schema.parse(raw);

  return (
    <SidebarInset>
      <View data={data} />
    </SidebarInset>
  );
}
