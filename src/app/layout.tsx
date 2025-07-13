import "@/styles/globals.css";

import {type Metadata} from "next";
import {Geist} from "next/font/google";
import {auth} from "@/server/auth";
import {SessionProvider} from "next-auth/react";

export const metadata: Metadata = {
    title: "BizLenz",
    description: "Business proposals, at your finest.",
    icons: [{rel: "icon", url: "/favicon.ico"}],
};

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

export default async function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    const session = await auth()

    return (
        <html lang="en" className={`dark ${geist.variable}`}>
        <body>
        <SessionProvider session={session}>{children}</SessionProvider>
        </body>
        </html>
    );
}
