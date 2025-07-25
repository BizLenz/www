"use client"

import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import FilesTablePage, { FilesTable } from "@/components/files-table";

export default function Files() {
  const [storageUsage, setStorageUsage] = useState<number>();

  // TODO: fetch from backend
  useEffect(() => {
    setStorageUsage(800.5);
  }, []);

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-10">
        <div className="flex items-baseline">
        <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
          내 문서함
        </h1>
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
      {/* Table */}
        <FilesTablePage />
      </div>
    </SidebarInset>
  );
}
