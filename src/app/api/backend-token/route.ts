// !! THIS IS A MOCK !!
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // !! MOCK CODE !!
  const mockFastApiToken = `MOCK_TOKEN_FOR_USER_${session.user.id}_${Date.now()}`;

  return NextResponse.json({
    token: mockFastApiToken,
    message:
      "This is a mock token for frontend development. Real JWT not generated yet.",
  });
  // !! END OF MOCK CODE !!
}
