"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function SafeAppSidebar() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <Skeleton className="h-10 w-full" />
          </SidebarHeader>
          <SidebarContent>
            <div className="flex flex-col items-center gap-2 p-4">
              <p className="text-destructive text-xs">
                사이드바를 불러올 수 없습니다
              </p>
              <Button variant="outline" size="sm" onClick={reset}>
                다시 시도
              </Button>
            </div>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      )}
    >
      <AppSidebar />
    </ErrorBoundary>
  );
}
