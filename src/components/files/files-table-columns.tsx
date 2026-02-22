"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import StatusBubble from "@/components/common/status-bubble";
import { AnalysisButton } from "@/components/analysis/analysis-button";
import { formatKoreanDate } from "@/lib/format-date";
import type { File } from "@/types/file";

export function createFileColumns(options: {
  router: AppRouterInstance;
  onDeleteClick: (id: number, name: string) => void;
}): ColumnDef<File>[] {
  const { router, onDeleteClick } = options;

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllRowsSelected() ||
            (table.getIsSomeRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "file_name",
      header: "파일 이름",
      size: 300,
      cell: ({ row }) => {
        const fileName = row.getValue("file_name");
        if (typeof fileName !== "string" || !fileName)
          throw new Error("File name is required");
        const truncatedName =
          fileName.length > 120 ? `${fileName.slice(0, 120)}...` : fileName;

        return (
          <div className="max-w-[200px] truncate font-medium" title={fileName}>
            {truncatedName}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "업로드 날짜",
      size: 250,
      cell: ({ row }) => {
        const createdAtValue = row.getValue<string | undefined | null>(
          "created_at",
        );
        return (
          <div className="font-medium">{formatKoreanDate(createdAtValue)}</div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      size: 120,
      cell: ({ row }) => {
        const status = row.getValue<File["status"]>("status");
        return <StatusBubble status={status} />;
      },
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        const file = row.original;
        const isCompleted = file.status === "completed";

        return (
          <div className="flex gap-2 text-right">
            {isCompleted ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  toast.info(`'${file.file_name}'의 결과 페이지로 이동합니다.`);
                  router.push(`/results/${file.id}`);
                }}
              >
                결과확인
              </Button>
            ) : (
              <AnalysisButton fileId={file.id} />
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDeleteClick(file.id, file.file_name)}
            >
              삭제
            </Button>
          </div>
        );
      },
      size: 120,
    },
  ];
}
