import { normalizeAnalysisResult } from "@/lib/normalize-analysis";
import type { Session } from "next-auth";

export async function getResult(id: string, session: Session | null) {
  if (!session) {
    throw new Error("Session not found");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/evaluation/results/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      // optional headers / cache policy
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch result");
  const data = await res.json();
  return normalizeAnalysisResult(data);
}
