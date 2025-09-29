import { type DefaultSession, type NextAuthConfig } from "next-auth";
import { type JWT } from "next-auth/jwt";
import Cognito from "next-auth/providers/cognito";

interface CognitoTokenResponse {
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    error?: string;
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      avatar: string | null;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
    accessToken?: string;
    idToken?: string;
    error?: "RefreshAccessTokenError" | "RefreshTokenInvalid";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accessToken?: string;
    idToken?: string;
    refreshToken?: string;
    expiresAt: number;
    error?: "RefreshAccessTokenError" | "RefreshTokenInvalid";
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Cognito({
      clientId: process.env.AUTH_COGNITO_CLIENT_ID,
      clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET,
      issuer: process.env.AUTH_COGNITO_ISSUER,
      authorization: {
        params: {
          response_type: "code",
          scope: "openid email profile bizlenz/read bizlenz/write",
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          expiresAt: Date.now() / 1000 + (account.expires_in ?? 3600), // Default 1 hour
          provider: account.provider,
        };
      }

      if (Date.now() / 1000 < token.expiresAt) {
        return token;
      }

      if (!token.refreshToken) {
        throw new Error("Missing refresh token");
      }

      try {
        const credentials = Buffer.from(
          `${process.env.AUTH_COGNITO_CLIENT_ID}:${process.env.AUTH_COGNITO_CLIENT_SECRET}`,
        ).toString("base64");

        const response = await fetch(
          `https://${process.env.AUTH_COGNITO_DOMAIN}.auth.ap-northeast.amazonaws.com/oauth2/token`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${credentials}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              client_id: process.env.AUTH_COGNITO_CLIENT_ID!,
              refresh_token: token.refreshToken,
              scope: "openid email profile bizlenz/read bizlenz/write",
            }).toString(),
          },
        );

        const tokens = await response.json() as CognitoTokenResponse;

        if (!response.ok) {
          console.error("Cognito token refresh failed:", tokens);
          if (tokens.error === "invalid_grant") {
            token.error = "RefreshTokenInvalid";
          } else {
            token.error = "RefreshAccessTokenError";
          }
          return token;
        }

        return {
          ...token,
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          refreshToken: tokens.refresh_token ?? token.refreshToken,
          expiresAt: Date.now() / 1000 + tokens.expires_in,
          error: undefined,
        };
      } catch (error) {
        console.error("Token refresh network error:", error);
        token.error = "RefreshAccessTokenError";
        return token;
      }
    },

    session: async ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        name: token.name,
        email: token.email,
        image: token.picture,
      },
      accessToken: token.accessToken,
      idToken: token.idToken,
      error: token.error,
    }),
  },
} satisfies NextAuthConfig;
