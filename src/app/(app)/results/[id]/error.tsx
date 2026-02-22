"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";

export default function ResultError({
  _error,
  reset,
}: {
  _error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SidebarInset>
      <div className="flex flex-1 items-center justify-center p-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>분석 결과를 불러올 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              분석 결과를 가져오는 중 문제가 발생했습니다. 잠시 후 다시 시도해
              주세요.
            </p>
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={reset}>다시 시도</Button>
            <Button variant="outline" asChild>
              <Link href="/files">문서함으로 돌아가기</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SidebarInset>
  );
}
