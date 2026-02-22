// !! THIS IS A MOCK !!
import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

// import jwt from "jsonwebtoken";

export async function GET(_request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
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

  /*
    const FASTAPI_JWT_SECRET = process.env.FASTAPI_JWT_SECRET;
    const TOKEN_EXPIRATION_SECONDS = 60 * 60;

    if (!FASTAPI_JWT_SECRET) {
      console.error("FASTAPI_JWT_SECRET is not defined!");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    try {
      const payload = {
        sub: session.user.id,
        email: session.user.email,
        name: session.user.name,
        // roles: session.user.roles,
      };

      const token = jwt.sign(payload, FASTAPI_JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION_SECONDS,
        algorithm: "HS256",
      });

      return NextResponse.json({ token });
    } catch (error) {
      console.error("Failed to generate backend token:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
    */
}
