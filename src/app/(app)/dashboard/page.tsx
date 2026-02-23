"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Box,
  ChartNoAxesColumnIncreasing,
  Hourglass,
  Rocket,
} from "lucide-react";
import StatCard from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import Notification from "@/components/notification";
import { DashboardFileForm } from "@/components/dashboard/dashboard-file-form";
import { DashboardRecentView } from "@/components/dashboard/dashboard-recent-view";
import { useFileStoreShallow } from "@/store/file-store";
import { useBackendToken } from "@/hooks/use-backend-token";

const GIGABYTE_IN_MEGABYTES = 1024;

export default function Page() {
  const { fastApiToken } = useBackendToken();
  const [teamName, setTeamName] = useState<string>();
  const [storageUsage, setStorageUsage] = useState<number>();

  const {
    files,
    size,
    isLoading,
    lastFetchSuccessful,
    fetchFiles,
    sumFilesNum,
    sumAnalysis,
    sumProcessing,
  } = useFileStoreShallow();

  useEffect(() => {
    setTeamName("test");
    setStorageUsage(size);
    if (
      lastFetchSuccessful === null &&
      files.length === 0 &&
      !isLoading &&
      fastApiToken
    ) {
      void fetchFiles(fastApiToken);
    }
  }, [
    files.length,
    isLoading,
    fetchFiles,
    lastFetchSuccessful,
    fastApiToken,
    size,
  ]);

  const recentActivityData = files.slice(0, 5);

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-10">
        {/* Title */}
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
          {teamName}
        </h1>
        {/* SubTitle */}
        <div className="flex justify-between">
          <p className="text-muted-foreground text-xl">
            새로운 가능성을 분석해보세요.
          </p>
          <div className="flex flex-1 flex-row items-center justify-end gap-4">
            <p className="text-muted-foreground text-sm">사용중인 저장공간</p>
            {storageUsage ? (
              <>
                <small className="text-sm leading-none font-medium">
                  {storageUsage}MiB/1GiB
                </small>
                <Progress
                  value={storageUsage / (GIGABYTE_IN_MEGABYTES / 100)}
                  className="w-[20%]"
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* ROW 1; Stats */}
        <div className="flex gap-4">
          <StatCard
            icon={<ChartNoAxesColumnIncreasing />}
            title={"총 분석 횟수"}
            count={sumAnalysis}
          />
          <StatCard
            icon={<Hourglass />}
            title={"분석 진행 중"}
            count={sumProcessing}
          />
          <StatCard
            icon={<Box />}
            title={"업로드된 파일"}
            count={sumFilesNum}
          />
        </div>
        {/* ROW 2; Files & Recent */}
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <DashboardFileForm />
          </div>
          <div className="flex-1">
            {/* TODO: fetch recentFiles from backend */}
            <DashboardRecentView recentFiles={recentActivityData} />
          </div>
        </div>
        {/* ROW 3; Notifications */}
        {/* TODO: fetch from backend */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="text-lg font-semibold">알림 및 공지</div>
            <Button>모든 알림 보기</Button>
          </div>
          <Notification
            icon={<Rocket />}
            title={"Lorem Ipsum"}
            body={
              "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            }
          />
          <Notification
            icon={<Rocket />}
            title={"Lorem Ipsum"}
            body={
              "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            }
          />
          <Notification
            icon={<Rocket />}
            title={"Lorem Ipsum"}
            body={
              "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"
            }
          />
        </div>
      </div>
    </SidebarInset>
  );
}
