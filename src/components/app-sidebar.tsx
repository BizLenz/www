"use client";

import * as React from "react";
import { useEffect, useState } from "react";

// Static imports
import { staticAppData } from "@/lib/app-sidebar-items";
import type { TeamData, UserData } from "@/types/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavReports } from "@/components/nav-reports";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { GalleryVerticalEnd } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [teamData, setTeamData] = useState<TeamData[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [userError, setUserError] = useState<string | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);

  // --- DUMMY DATA FETCHES FOR DEVELOPMENT ---
  useEffect(() => {
    const fetchDummyUserData = async () => {
      try {
        setIsLoading(true);
        setUserError(null);

        const dummyUserData: UserData = {
          name: "Lorem Ipsum",
          email: "lorem@ipsum.com",
          avatar: "",
        };

        await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms delay

        setUserData(dummyUserData);
      } catch (err: any) {
        setUserError(err.message || "Failed to load dummy user data.");
        console.error("Error loading dummy user data:", err);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDummyTeamData = async () => {
      try {
        setIsLoading(true);
        setTeamError(null);

        const dummyTeamData: TeamData[] = [
          {
            name: "Lorem Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
          },
          {
            name: "Ipsum Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 800));

        setTeamData(dummyTeamData);
      } catch (err: any) {
        setTeamError(err.message || "Failed to load dummy team data.");
        console.error("Error loading dummy team data:", err);
        setTeamData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDummyUserData();
    fetchDummyTeamData();
  }, []);

  if (isLoading) {
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

  // TODO: Add UI fallback for fetch error
  if (userError || teamError) {
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {teamData ? (
          <TeamSwitcher teams={teamData} />
        ) : (
          // Fallback
          <TeamSwitcher teams={[]} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staticAppData.navMain} />
        <NavReports reports={staticAppData.reports} />
      </SidebarContent>
      <SidebarFooter>
        {userData ? (
          <NavUser user={userData} />
        ) : (
          // Fallback
          <NavUser
            user={{
              name: "Guest",
              email: "guest@example.com",
              avatar: "",
            }}
          />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
