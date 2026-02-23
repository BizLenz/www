import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const reqUrl = new URL(request.url);

  if (sessionCookie && reqUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!sessionCookie && reqUrl.pathname !== "/login") {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${encodeURIComponent(reqUrl.pathname + reqUrl.search)}`,
        request.url,
      ),
    );
  }

  return NextResponse.next();
}
