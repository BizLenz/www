import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { BackendTokenProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "BizLenz",
  description: "Business proposals, at its finest.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geist.variable}`}>
      <body>
        <BackendTokenProvider>{children}</BackendTokenProvider>
      </body>
    </html>
  );
}
