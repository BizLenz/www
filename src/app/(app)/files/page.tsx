"use client"

import {Progress} from "@/components/ui/progress";
import {useEffect, useState} from "react";
import {SidebarInset} from "@/components/ui/sidebar";
import {FilesTable} from "@/components/files-table";
import {Toaster} from "sonner";
import {useFileStoreShallow} from "@/store/file-store";
import { fetchPlansByUser } from "@/hooks/plans";

export async function FilesPage() {
  // 실제로는 세션에서 userId 읽어옴
  const userId = 1;
  const plans = await fetchPlansByUser(userId);

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Uploaded Business Plans</h1>
      <ul className="space-y-3">
        {plans.map(p => (
          <li key={p.id} className="rounded-xl p-4 border">
            <div className="font-medium">{p.file_name}</div>
            <div className="text-sm text-muted-foreground">{p.file_path}</div>
            <div className="text-sm">
              Latest Job: {p.latest_job_id ?? '—'}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function Files() {
    const [storageUsage, setStorageUsage] = useState<number>();

    const {files, isLoading, error, fetchFiles} = useFileStoreShallow();

    // TODO: fetch from backend
    useEffect(() => {
        setStorageUsage(800.5);
        void fetchFiles();
    }, [fetchFiles]);

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
                                <Progress value={storageUsage / 10.24} className="w-[20%]"/>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                {/* Table */}
                <div className="container mx-auto py-10">
                    <Toaster richColors position="top-right"/>
                    <FilesTable data={files}/>
                </div>
            </div>
        </SidebarInset>
    );
}
