import type { ZodSchema } from "zod";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function resultPage<TRaw, TParsed>({
  params,
  fetcher,
  schema,
  View,
}: {
  params: Promise<{ id: string }>;
  fetcher: (id: string, token: string | undefined) => Promise<TRaw>;
  schema: ZodSchema<TParsed>;
  View: React.ComponentType<{ data: TParsed }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const token = session?.session?.token;
  const raw = await fetcher(id, token);
  const data = schema.parse(raw);

  return (
    <SidebarInset>
      <View data={data} />
    </SidebarInset>
  );
}
