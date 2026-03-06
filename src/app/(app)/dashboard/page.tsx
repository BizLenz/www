"use client";

import { SidebarInset } from "@/components/ui/sidebar";
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
import { useFilesData } from "@/hooks/use-files-data";
import { ErrorBanner } from "@/components/common/error-banner";
import { StorageUsageBar } from "@/components/common/storage-usage-bar";

export default function Page() {
  const {
    files,
    size,
    error,
    refetch,
    sumFilesNum,
    sumAnalysis,
    sumProcessing,
  } = useFilesData();

  const recentActivityData = files.slice(0, 5);

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-10">
        {/* Title */}
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
          test
        </h1>
        {/* SubTitle */}
        <div className="flex justify-between">
          <p className="text-muted-foreground text-xl">
            새로운 가능성을 분석해보세요.
          </p>
          <StorageUsageBar usedMiB={size} />
        </div>
        {/* Error banner */}
        {error && <ErrorBanner error={error} onRetry={refetch} />}
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
