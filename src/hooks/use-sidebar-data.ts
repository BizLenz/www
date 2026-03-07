"use client";

import { useEffect, useRef, useState } from "react";
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

  const userFetchedRef = useRef(false);
  const teamFetchedRef = useRef(false);

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
      if (userFetchedRef.current) return;
      userFetchedRef.current = true;

      setIsLoadingUserData(true);
      setUserError(null);

      try {
        if (!session.data?.user?.name) {
          throw new Error("User name is missing");
        }
        if (!session.data?.user?.email) {
          throw new Error("User email is missing");
        }

        setUserData({
          name: session.data.user.name,
          email: session.data.user.email,
          avatar: session.data.user.image ?? "",
        });
      } catch (err: unknown) {
        userFetchedRef.current = false;
        setUserError(getErrorMessage(err));
        setUserData(null);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    // --- DUMMY FETCH FOR DEVELOPMENT ---
    const fetchTeamData = async () => {
      if (teamFetchedRef.current) return;
      teamFetchedRef.current = true;

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

        setTeamData(dummyTeamData);
      } catch (err: unknown) {
        teamFetchedRef.current = false;
        setTeamError(getErrorMessage(err));
        setTeamData(null);
      } finally {
        setIsLoadingTeamData(false);
      }
    };

    void fetchUserData();
    void fetchTeamData();
  }, [sessionStatus, isTokenReady, session.data?.user]);

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
