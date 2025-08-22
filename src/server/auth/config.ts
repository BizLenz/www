import {type DefaultSession, type NextAuthConfig} from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

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
        accessToken?: string;
        idToken?: string;
        refreshToken?: string;
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
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
                    scope: "openid email profile",
                },
            },
        })
        /**
         * ...add more providers here.
         *
         * Refer to the NextAuth.js docs for the provider you want to use. Example:
         *
         * @see https://next-auth.js.org/providers/github
         */
    ],
    callbacks: {
        async jwt({token, user, account, profile}) {
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.refreshToken = account.refresh_token;
            }

            if (user) {
                token.sub = user.id;
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }
            return token;
        },

        session: ({session, token}) => ({
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
        }),
    },
} satisfies NextAuthConfig;
