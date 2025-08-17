"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    useEffect(() => {
        if (error) {
            console.error("Login Error:", error);
        }

        if (status === "loading") {
            return;
        }

        if (session) {
            console.log("User already signed in, redirecting to:", callbackUrl);
            router.push(callbackUrl);
            return;
        }

        if (!session && !error) {
            console.log("No session found, initiating sign-in to Cognito...");
            signIn("cognito", { callbackUrl: callbackUrl });
        }
    }, [session, status, error, router, callbackUrl]);

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                fontSize: "1.2em",
                flexDirection: "column",
                textAlign: "center",
            }}
        >
            {status === "loading" && <p>Checking authentication status...</p>}
            {status === "unauthenticated" && !error && (
                <p>Redirecting to login with Cognito...</p>
            )}
            {error && (
                <>
                    <p style={{ color: "red" }}>Login failed:</p>
                    <p>{error}</p>
                    <button onClick={() => signIn("cognito", { callbackUrl: callbackUrl })}>
                        Try logging in again
                    </button>
                </>
            )}
        </div>
    );
}