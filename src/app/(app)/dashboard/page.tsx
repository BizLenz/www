"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Box, ChartNoAxesColumnIncreasing, Hourglass, Rocket } from "lucide-react";
import Post from "@/components/post";
import { Button } from "@/components/ui/button";
import Notification from "@/components/notification";

export default function Page() {
  const [teamName, setTeamName] = useState<string>();
  const [storageUsage, setStorageUsage] = useState<number>();

  useEffect(() => {
    setTeamName("test");
    setStorageUsage(800.5);
  }, []);

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-10 pt-0">
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
                <Progress value={storageUsage / 10.24} className="w-[20%]" />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* ROW 1; Posts */}
        <div className="flex gap-4">
          <Post
            icon={<ChartNoAxesColumnIncreasing />}
            title={"총 분석 횟수"}
            count={5}
          />
          <Post icon={<Hourglass />} title={"분석 진행 중"} count={1} />
          <Post icon={<Box />} title={"업로드된 파일"} count={12} />
        </div>
        {/* ROW 2; Files & Recent */}
        <div className="flex gap-4"></div>
        {/* ROW 3; Notifications */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="text-lg font-semibold">알림 및 공지</div>
            <Button>모든 알림 보기</Button>
          </div>
          <Notification icon={<Rocket />} title={"Lorem Ipsum"}
                        body={"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"} />
          <Notification icon={<Rocket />} title={"Lorem Ipsum"}
                        body={"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"} />
          <Notification icon={<Rocket />} title={"Lorem Ipsum"}
                        body={"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"} />
        </div>
      </div>
    </SidebarInset>
  );
}
