"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";

import { staticAppData } from "@/lib/app-sidebar-items";
import type { UserData } from "@/types/sidebar";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavReports } from "@/components/sidebar/nav-reports";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryVerticalEnd } from "lucide-react";
import { getErrorMessage, isError } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useBackendToken } from "@/hooks/use-backend-token";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status: sessionStatus } = useSession();
  const { fastApiToken, isLoadingFastApiToken, errorFastApiToken } =
    useBackendToken();

  // User State
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    if (
      sessionStatus === "authenticated" &&
      fastApiToken &&
      !isLoadingFastApiToken &&
      !errorFastApiToken
    ) {
      // --- Fetch User Data ---
      const fetchUserData = async () => {
        if (isLoadingUserData || userData) return;

        setIsLoadingUserData(true);
        setUserError(null);

        if (!session?.user?.name) {
          throw new Error("User name is missing");
        }
        if (!session?.user?.email) {
          throw new Error("User email is missing");
        }

        try {
          console.log("DashboardComponent: Fetching user data");
          const userData: UserData = {
            name: session?.user?.name,
            email: session?.user?.email,
            avatar: session?.user?.image ?? "",
          };

          await new Promise((resolve) => setTimeout(resolve, 800));
          setUserData(userData);
        } catch (err: unknown) {
          const errorMessage = getErrorMessage(err);
          setUserError(errorMessage);
          setUserData(null);
          if (isError(err))
            console.error("Error loading user data:", err.message);
          else console.error("Caught unexpected error loading user data:", err);
        } finally {
          setIsLoadingUserData(false);
        }
      };

      void fetchUserData();
    }
  }, [
    sessionStatus,
    fastApiToken,
    isLoadingUserData,
    userData,
    session?.user?.name,
    session?.user?.email,
    session?.user?.image,
    errorFastApiToken,
    isLoadingFastApiToken,
  ]);

  if (sessionStatus === "loading") {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <Skeleton className="h-10 w-full" />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={staticAppData.navMain} />
          <NavReports reports={staticAppData.reports} />
        </SidebarContent>
        <SidebarFooter>
          <Skeleton className="h-10 w-full" />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (isLoadingFastApiToken || errorFastApiToken || !fastApiToken) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <Skeleton className="h-10 w-full" />
        </SidebarHeader>
        <SidebarContent></SidebarContent>
        <SidebarFooter>
          <Skeleton className="h-10 w-full" />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 rounded-xl border p-2">
          <Image
            width={28}
            height={28}
            src="https://raw.githubusercontent.com/BizLenz/.github/refs/heads/main/assets/logo/logo_dark.svg"
            alt="BizLenz Logo"
          />
          <div className="text-xl font-bold">BizLenz.</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticAppData.navMain} />
        <NavReports reports={staticAppData.reports} />
      </SidebarContent>
      <SidebarFooter>
        {isLoadingUserData ? (
          <Skeleton className="h-10 w-full" />
        ) : userError ? (
          <div style={{ color: "red", padding: "8px" }}>Error: {userError}</div>
        ) : (
          <NavUser
            user={
              userData ?? {
                name: "Guest",
                email: "guest@example.com",
                avatar: "",
              }
            }
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
