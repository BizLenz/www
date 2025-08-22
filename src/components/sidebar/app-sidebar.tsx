"use client";

import * as React from "react";
import {useEffect, useState} from "react";

// Static imports
import {staticAppData} from "@/lib/app-sidebar-items";
import type {TeamData, UserData} from "@/types/sidebar";

import {NavMain} from "@/components/sidebar/nav-main";
import {NavReports} from "@/components/sidebar/nav-reports";
import {NavUser} from "@/components/sidebar/nav-user";
import {TeamSwitcher} from "@/components/sidebar/team-switcher";
import {Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail,} from "@/components/ui/sidebar";
import {Skeleton} from "@/components/ui/skeleton";
import {GalleryVerticalEnd} from "lucide-react";
import {getErrorMessage, isError} from "@/lib/utils";
import {useSession} from "next-auth/react";
import {useBackendToken} from "@/hooks/use-backend-token";

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {data: session, status: sessionStatus} = useSession();
    const {fastApiToken, isLoadingFastApiToken, errorFastApiToken} = useBackendToken();

    // User State
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);

    // Team State
    const [teamData, setTeamData] = useState<TeamData[] | null>(null);
    const [isLoadingTeamData, setIsLoadingTeamData] = useState(false);
    const [teamError, setTeamError] = useState<string | null>(null);

    // --- DUMMY DATA FETCHES FOR DEVELOPMENT ---
    useEffect(() => {
        if (sessionStatus === "authenticated" && fastApiToken && !isLoadingFastApiToken && !errorFastApiToken) {

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
                    if (isError(err)) console.error("Error loading user data:", err.message);
                    else console.error("Caught unexpected error loading user data:", err);
                } finally {
                    setIsLoadingUserData(false);
                }
            };

            // --- Fetch Team Data ---
            const fetchTeamData = async () => {
                if (isLoadingTeamData || teamData) return;

                setIsLoadingTeamData(true);
                setTeamError(null);

                try {
                    // --- BEGIN MOCK TEAM DATA SIMULATION ---
                    // TODO: Replace with actual FastAPI team data fetch later
                    console.log("DashboardComponent: Simulating team data fetch with token:", fastApiToken);
                    const dummyTeamData: TeamData[] = [{
                        name: "Lorem Inc", logo: GalleryVerticalEnd, plan: "Enterprise",
                    }, {
                        name: "Ipsum Inc", logo: GalleryVerticalEnd, plan: "Enterprise",
                    },];

                    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate latency
                    setTeamData(dummyTeamData);
                    // --- END MOCK TEAM DATA SIMULATION ---

                    /*
                    // const res = await fetch("http://fastapi.url/api/teams", {
                    //   headers: { Authorization: `Bearer ${fastApiToken}` },
                    // });
                    // if (!res.ok) throw new Error("Failed to fetch team data");
                    // const realData = await res.json();
                    // setTeamData(realData);
                    */

                } catch (err: unknown) {
                    const errorMessage = getErrorMessage(err);
                    setTeamError(errorMessage);
                    setTeamData(null);
                    if (isError(err)) console.error("Error loading team data:", err.message); else console.error("Caught unexpected error loading team data:", err);
                } finally {
                    setIsLoadingTeamData(false);
                }
            };

            void fetchUserData();
            void fetchTeamData();
        }
    }, [sessionStatus, fastApiToken, isLoadingUserData, userData, isLoadingTeamData, teamData, session?.user?.name, session?.user?.email, session?.user?.image, errorFastApiToken, isLoadingFastApiToken]);

    if (sessionStatus === "loading") {
        return (<Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Skeleton className="h-10 w-full"/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={staticAppData.navMain}/>
                <NavReports reports={staticAppData.reports}/>
            </SidebarContent>
            <SidebarFooter>
                <Skeleton className="h-10 w-full"/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>);
    }

    if (isLoadingFastApiToken || errorFastApiToken || !fastApiToken) {
        return (<Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Skeleton className="h-10 w-full"/>
            </SidebarHeader>
            <SidebarContent></SidebarContent>
            <SidebarFooter>
                <Skeleton className="h-10 w-full"/>
            </SidebarFooter>
        </Sidebar>)
    }

    return (<Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
            {isLoadingTeamData ? (<Skeleton className="h-10 w-full"/>) : teamError ? (
                <div style={{color: "red", padding: "8px"}}>Error: {teamError}</div>) : (
                <TeamSwitcher teams={teamData}/>)}
        </SidebarHeader>
        <SidebarContent>
            <NavMain items={staticAppData.navMain}/>
            <NavReports reports={staticAppData.reports}/>
        </SidebarContent>
        <SidebarFooter>
            {isLoadingUserData ? (<Skeleton className="h-10 w-full"/>) : userError ? (
                <div style={{color: "red", padding: "8px"}}>Error: {userError}</div>) : (
                <NavUser user={userData ?? {name: "Guest", email: "guest@example.com", avatar: ""}}/>)}
        </SidebarFooter>
        <SidebarRail/>
    </Sidebar>);
}
