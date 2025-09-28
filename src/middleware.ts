import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const reqUrl = new URL(req.url);
  const isAuthenticated = !!req.auth;

  console.log(
    `[Middleware] Path: ${reqUrl.pathname}, IsAuthenticated: ${isAuthenticated}`,
    `Auth object: ${req.auth ? "present" : "absent"}`, // More explicit check
  );
  if (req.auth) {
    console.log(`[Middleware] User ID: ${req.auth.user?.id || "N/A"}`);
    console.log(
      `[Middleware] Access Token in session: ${!!req.auth.accessToken}`,
    );
  }

  if (isAuthenticated && reqUrl.pathname === "/") {
    console.log(
      "Middleware: Authenticated user on root, redirecting to /dashboard",
    );
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && reqUrl.pathname !== "/login") {
    console.log("Middleware: Unauthenticated user, redirecting to /login");
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${encodeURIComponent(reqUrl.pathname + reqUrl.search)}`,
        req.url,
      ),
    );
  }

  console.log(
    `[Middleware] No redirect for path: ${reqUrl.pathname}. Continuing.`,
  );
  return NextResponse.next();
});
