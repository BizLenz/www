"use client"

import {GalleryVerticalEnd} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {signIn, useSession} from "next-auth/react"
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const {status} = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    useEffect(() => {
        if (status === 'authenticated') {
            console.log("Login Page: Authenticated, redirecting to", callbackUrl);
            router.push(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    if (status === 'loading') {
        return <div>Loading authentication status...</div>;
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6"/>
                            </div>
                            <span className="sr-only">BizLenz</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to BizLenz.</h1>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="#" className="underline underline-offset-4">
                                Sign up
                            </a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="lorem@ipsum.com"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                    <div
                        className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Button variant="outline" type="button" className="w-full"
                                onClick={() => signIn('discord', {callbackUrl: callbackUrl})}>
                            <svg viewBox="0 0 256 199" width="256" height="199" xmlns="http://www.w3.org/2000/svg"
                                 preserveAspectRatio="xMidYMid">
                                <path
                                    d="M216.856 16.597A208.502 208.502 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046-19.692-2.961-39.203-2.961-58.533 0-1.832-4.4-4.55-9.933-6.846-14.046a207.809 207.809 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161.094 161.094 0 0 0 79.735 175.3a136.413 136.413 0 0 1-21.846-10.632 108.636 108.636 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a131.66 131.66 0 0 0 5.355 4.237 136.07 136.07 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848 21.142-6.58 42.646-16.637 64.815-33.213 5.316-56.288-9.08-105.09-38.056-148.36ZM85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2c12.867 0 23.236 11.804 23.015 26.2.02 14.375-10.148 26.18-23.015 26.18Zm85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2 0 14.375-10.148 26.18-23.015 26.18Z"
                                    fill="#5865F2"/>
                            </svg>
                            Continue with Discord
                        </Button>
                    </div>
                </div>
            </form>
            <div
                className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
