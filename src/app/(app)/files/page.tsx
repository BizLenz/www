"use client";

import { SidebarInset } from "@/components/ui/sidebar";
import { FilesTable } from "@/components/files/files-table";
import { Toaster } from "sonner";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { useFilesData } from "@/hooks/use-files-data";
import { ErrorBanner } from "@/components/common/error-banner";
import { StorageUsageBar } from "@/components/common/storage-usage-bar";

export default function Files() {
  const { files, size, error, refetch } = useFilesData();

  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-10">
        <div className="flex items-baseline">
          <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-balance">
            내 문서함
          </h1>
          <StorageUsageBar usedMiB={size} />
        </div>
        {/* Table */}
        <div className="container mx-auto py-10">
          <Toaster richColors position="top-right" />
          {error && <ErrorBanner error={error} onRetry={refetch} className="mb-4" />}
          <ErrorBoundary>
            <FilesTable data={files} onRefetchFilesAction={refetch} />
          </ErrorBoundary>
        </div>
      </div>
    </SidebarInset>
  );
}
