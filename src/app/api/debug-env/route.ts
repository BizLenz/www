import { NextResponse } from "next/server";

export async function GET() {
  const debugEnv = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "NOT SET",
    AUTH_COGNITO_CLIENT_ID: process.env.AUTH_COGNITO_CLIENT_ID,
    AUTH_COGNITO_CLIENT_SECRET: process.env.AUTH_COGNITO_CLIENT_SECRET
      ? "SET"
      : "NOT SET",
    AUTH_COGNITO_ISSUER: process.env.AUTH_COGNITO_ISSUER,
    AUTH_COGNITO_DOMAIN: process.env.AUTH_COGNITO_DOMAIN,
  };
  return NextResponse.json(debugEnv);
}
