"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV === "development") {
    console.error("[AppError]", error);
  }
  return (
    <SidebarInset>
      <div className="flex flex-1 items-center justify-center p-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>문제가 발생했습니다</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              페이지를 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={reset}>다시 시도</Button>
          </CardFooter>
        </Card>
      </div>
    </SidebarInset>
  );
}
