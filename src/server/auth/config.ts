import { type DefaultSession, type JWT, type NextAuthConfig } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { getErrorMessage } from "@/lib/utils";

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
  }

  interface JWT {
    id: string;
    access_token?: string;
    id_token?: string;
    refresh_token?: string;
    expires_in?: number;
    accessTokenExpiresAt?: number;
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

async function refreshCognitoAccessToken(refreshToken: string) {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.AUTH_COGNITO_CLIENT_ID!);
  params.append("refresh_token", refreshToken);

  const cognitoTokenEndpoint = `${process.env.AUTH_COGNITO_ISSUER}/oauth2/token`;

  try {
    const response = await fetch(cognitoTokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error: unknown = await response.json();
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      throw new Error("Failed to refresh access token: " + errorMessage);
    }

    const data = (await response.json()) as JWT;

    const expiresIn = data.expires_in;
    if (!expiresIn) {
        throw new Error('Missing expires_in from token response');
    }

    return {
      accessToken: data.access_token,
      idToken: data.id_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: Math.floor(Date.now() / 1000) + expiresIn,
    };
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    throw error;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CognitoProvider({
      clientId: process.env.AUTH_COGNITO_CLIENT_ID,
      clientSecret: process.env.AUTH_COGNITO_CLIENT_SECRET,
      issuer: process.env.AUTH_COGNITO_ISSUER,
      authorization: {
        params: {
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
      if (account && user) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpiresAt =
          Math.floor(Date.now() / 1000) + account.expires_in!;

        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;

        return token;
      }

      if (
        !token.accessToken ||
        (token.accessTokenExpiresAt &&
          Date.now() / 1000 > (token.accessTokenExpiresAt as number))
      ) {
        if (token.refreshToken) {
          try {
            console.log("Attempting to refresh access token...");
            const refreshedTokens = await refreshCognitoAccessToken(
              token.refreshToken as string,
            );

            token.accessToken = refreshedTokens.accessToken;
            token.idToken = refreshedTokens.idToken ?? token.idToken;
            token.refreshToken =
              refreshedTokens.refreshToken ?? token.refreshToken;
            token.accessTokenExpiresAt = refreshedTokens.expiresAt;
            console.log("Access token refreshed successfully.");
          } catch (error: unknown) {
            const errorMessage = getErrorMessage(error);
            console.error(
              "Failed to refresh token, logging out..." + errorMessage,
            );

            token.accessToken = undefined;
            token.idToken = undefined;
            token.refreshToken = undefined;
            token.accessTokenExpiresAt = undefined;
          }
        } else {
          console.log("No refresh token found, logging out...");
          token.accessToken = undefined;
          token.idToken = undefined;
          token.refreshToken = undefined;
          token.accessTokenExpiresAt = undefined;
        }
      }

      return token;
    },

    session: ({ session, token }) => {
      // Only include accessToken if it's still valid
      if (
        token.accessToken &&
        (!token.accessTokenExpiresAt ||
          Date.now() / 1000 < (token.accessTokenExpiresAt as number))
      ) {
        session.accessToken = token.accessToken as string;
      } else {
        session.accessToken = undefined; // expired token is not passed
      }

      session.idToken = token.idToken as string;

      if (token.sub) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.sub,
            name: token.name,
            email: token.email,
            image: token.picture,
          },
        };
      }

      return session; // return original if no sub
    },
  },
  // TODO: is now in debug mode; change in prod
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
