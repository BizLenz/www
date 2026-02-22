"use client";

import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { FilesTable } from "@/components/files/files-table";
import { Toaster } from "sonner";
import { useFileStoreShallow } from "@/store/file-store";
import { useSession } from "next-auth/react";
import { ErrorBoundary } from "@/components/common/error-boundary";

export default function Files() {
  const { data: session, status } = useSession();
  const [storageUsage, setStorageUsage] = useState<number>();

  const { files, size, isLoading, error, lastFetchSuccessful, fetchFiles } =
    useFileStoreShallow();

  const memoizedRefetchFiles = useCallback(() => {
    if (session) {
      void fetchFiles(session);
    }
  }, [fetchFiles, session]);

  useEffect(() => {
    setStorageUsage(size);
    if (
      lastFetchSuccessful === null &&
      files.length === 0 &&
      !isLoading &&
      session
    ) {
      void fetchFiles(session);
    }
  }, [size, files.length, isLoading, session, fetchFiles]);

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
        <div className="container mx-auto py-10">
          <Toaster richColors position="top-right" />
          <ErrorBoundary>
            <FilesTable
              data={files}
              onRefetchFilesAction={memoizedRefetchFiles}
            />
          </ErrorBoundary>
        </div>
      </div>
    </SidebarInset>
  );
}
