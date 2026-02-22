import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const reqUrl = new URL(req.url);
  const isAuthenticated = !!req.auth;

  if (isAuthenticated && reqUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && reqUrl.pathname !== "/login") {
    return NextResponse.redirect(
      new URL(
        `/login?callbackUrl=${encodeURIComponent(reqUrl.pathname + reqUrl.search)}`,
        req.url,
      ),
    );
  }

  return NextResponse.next();
});
