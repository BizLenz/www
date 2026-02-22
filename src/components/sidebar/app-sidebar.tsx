"use client";

import * as React from "react";

import { staticAppData } from "@/lib/app-sidebar-items";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavReports } from "@/components/sidebar/nav-reports";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSidebarData } from "@/hooks/use-sidebar-data";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    userData,
    isLoadingUserData,
    userError,
    teamData,
    isLoadingTeamData,
    teamError,
    sessionStatus,
    isTokenReady,
  } = useSidebarData();

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

  if (!isTokenReady) {
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
        {isLoadingTeamData ? (
          <Skeleton className="h-10 w-full" />
        ) : teamError ? (
          <div style={{ color: "red", padding: "8px" }}>Error: {teamError}</div>
        ) : (
          <TeamSwitcher teams={teamData} />
        )}
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
