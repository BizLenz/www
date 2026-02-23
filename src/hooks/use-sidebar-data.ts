"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { GalleryVerticalEnd } from "lucide-react";
import type { TeamData, UserData } from "@/types/sidebar";
import { useBackendToken } from "@/hooks/use-backend-token";
import { getErrorMessage } from "@/lib/utils";

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
  const session = authClient.useSession();
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

  const sessionStatus: "loading" | "authenticated" | "unauthenticated" =
    session.isPending
      ? "loading"
      : session.data
        ? "authenticated"
        : "unauthenticated";

  useEffect(() => {
    if (sessionStatus !== "authenticated" || !isTokenReady) return;

    const fetchUserData = async () => {
      if (isLoadingUserData || userData) return;

      setIsLoadingUserData(true);
      setUserError(null);

      if (!session.data?.user?.name) {
        throw new Error("User name is missing");
      }
      if (!session.data?.user?.email) {
        throw new Error("User email is missing");
      }

      try {
        const userData: UserData = {
          name: session.data.user.name,
          email: session.data.user.email,
          avatar: session.data.user.image ?? "",
        };

        await new Promise((resolve) => setTimeout(resolve, 800));
        setUserData(userData);
      } catch (err: unknown) {
        setUserError(getErrorMessage(err));
        setUserData(null);
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
      } catch (err: unknown) {
        setTeamError(getErrorMessage(err));
        setTeamData(null);
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
    session.data?.user?.name,
    session.data?.user?.email,
    session.data?.user?.image,
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
