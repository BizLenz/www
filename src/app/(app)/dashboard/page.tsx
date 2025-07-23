"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Box, ChartNoAxesColumnIncreasing, Hourglass } from "lucide-react";
import Post from "@/components/post";

export default function Page() {
  const [teamName, setTeamName] = useState<string>();
  const [storageUsage, setStorageUsage] = useState<number>();

  useEffect(() => {
    setTeamName("test");
    setStorageUsage(800.5);
  }, []);

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
          {teamName}
        </h1>
        <p className="text-muted-foreground text-xl">
          새로운 가능성을 분석해보세요.
        </p>
        <div className="flex flex-1 flex-row items-center gap-4">
          <p className="text-muted-foreground text-sm">사용중인 저장공간</p>
          <small className="text-sm leading-none font-medium">
            {storageUsage}MiB/1GiB
          </small>
          {storageUsage ? (
            <Progress value={storageUsage / 10.24} className="w-[20%]" />
          ) : (
            <Progress value={100} className="w-[20%]" />
          )}
        </div>
        <div className="flex gap-4">
          <Post icon={<ChartNoAxesColumnIncreasing />} title={"총 분석 횟수"} count={5} />
          <Post icon={<Hourglass />} title={"분석 진행 중"} count={1} />
          <Post icon={<Box />} title={"업로드된 파일"} count={12} />
        </div>
      </div>
    </SidebarInset>
  );
}
