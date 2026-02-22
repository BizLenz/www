"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { GalleryVerticalEnd } from "lucide-react";
import type { TeamData, UserData } from "@/types/sidebar";
import { useBackendToken } from "@/hooks/use-backend-token";
import { getErrorMessage, isError } from "@/lib/utils";

interface SidebarData {
  userData: UserData | null;
  isLoadingUserData: boolean;
  userError: string | null;
  teamData: TeamData[] | null;
  isLoadingTeamData: boolean;
  teamError: string | null;
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
  isTokenReady: boolean;
}

export function useSidebarData(): SidebarData {
  const { data: session, status: sessionStatus } = useSession();
  const { fastApiToken, isLoadingFastApiToken, errorFastApiToken } =
    useBackendToken();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const [teamData, setTeamData] = useState<TeamData[] | null>(null);
  const [isLoadingTeamData, setIsLoadingTeamData] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);

  const isTokenReady =
    !isLoadingFastApiToken && !errorFastApiToken && !!fastApiToken;

  useEffect(() => {
    if (sessionStatus !== "authenticated" || !isTokenReady) return;

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
        const userData: UserData = {
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.image ?? "",
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

    // --- DUMMY FETCH FOR DEVELOPMENT ---
    const fetchTeamData = async () => {
      if (isLoadingTeamData || teamData) return;

      setIsLoadingTeamData(true);
      setTeamError(null);

      try {
        // TODO: Replace with actual FastAPI team data fetch later
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

        await new Promise((resolve) => setTimeout(resolve, 1200));
        setTeamData(dummyTeamData);

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
        if (isError(err))
          console.error("Error loading team data:", err.message);
        else console.error("Caught unexpected error loading team data:", err);
      } finally {
        setIsLoadingTeamData(false);
      }
    };

    void fetchUserData();
    void fetchTeamData();
  }, [
    sessionStatus,
    isTokenReady,
    isLoadingUserData,
    userData,
    isLoadingTeamData,
    teamData,
    session?.user?.name,
    session?.user?.email,
    session?.user?.image,
  ]);

  return {
    userData,
    isLoadingUserData,
    userError,
    teamData,
    isLoadingTeamData,
    teamError,
    sessionStatus,
    isTokenReady,
  };
}
