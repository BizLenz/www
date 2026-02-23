"use client";

import { Suspense, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginSkeleton() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.2em",
      }}
    >
      <p>Checking authentication status...</p>
    </div>
  );
}

function LoginContent() {
  const session = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [signInError, setSignInError] = useState<string | null>(errorParam);

  useEffect(() => {
    if (session.isPending) {
      return;
    }

    if (session.data) {
      router.push(callbackUrl);
      return;
    }

    if (!session.data && !signInError) {
      void authClient.signIn
        .social({
          provider: "google",
          callbackURL: callbackUrl,
        })
        .then(({ error }) => {
          if (error) {
            setSignInError(error.message ?? "Sign-in failed");
          }
        });
    }
  }, [session.data, session.isPending, signInError, router, callbackUrl]);

  const handleRetry = () => {
    setSignInError(null);
  };

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
        gap: "1rem",
      }}
    >
      {session.isPending && <p>Checking authentication status...</p>}
      {!session.isPending && !session.data && !signInError && (
        <p>Redirecting to login with Google...</p>
      )}
      {signInError && (
        <>
          <p style={{ color: "red" }}>Login failed:</p>
          <p>{signInError}</p>
          <button onClick={handleRetry}>Try logging in again</button>
        </>
      )}
    </div>
  );
}
