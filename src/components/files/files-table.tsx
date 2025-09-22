"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBubble from "@/components/common/status-bubble";
import type { File } from "@/types/file";
import { AnalysisButton } from "@/components/analysis/analysis-button";
import { useRouter } from "next/navigation";
import { FilesUploadButton } from "@/components/files/files-upload-button";
import { useSession } from "next-auth/react";
import { DeleteConfirmationModal } from "@/components/common/delete-confirmation-modal";
import { useFileDelete } from "@/hooks/use-delete-file";

export function FilesTable({ data }: { data: File[] }) {
  const { data: session, status } = useSession();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    fileId?: number;
    fileName?: string;
  }>({
    isOpen: false,
    fileId: undefined,
    fileName: undefined,
  });

  const router = useRouter();
  const { mutate: deleteFile, isPending: isDeleting } = useFileDelete();

  const handleDeleteClick = (fileId: number, fileName: string) => {
    setDeleteModal({
      isOpen: true,
      fileId,
      fileName,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.fileId && deleteModal.fileName) {
      const result = await deleteFile(deleteModal.fileId);

      if (result?.success) {
        toast.warning(`'${deleteModal.fileName}' 파일이 삭제되었습니다.`, {
          description: "선택한 파일이 성공적으로 삭제되었습니다.",
        });
        // TODO: reload the table after a deletion is made
      } else {
        console.error("File deletion failed:", result);
        toast.error("파일 삭제에 실패했습니다.");
      }
    }
  };

  const handleCloseModal = () => {
    setDeleteModal({ isOpen: false, fileId: undefined, fileName: undefined });
  };

  const columns: ColumnDef<File>[] = [
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
        const fileName = row.getValue("file_name") as string;
        if (!fileName) throw new Error("File name is required");
        // limit to 120 characters with ellipsis
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
        let formattedDate = "";

        // only proceed if createdAtValue is not null or undefined
        if (createdAtValue) {
          try {
            const date = new Date(createdAtValue);

            if (!isNaN(date.getTime())) {
              formattedDate = new Intl.DateTimeFormat("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              }).format(date);
            } else {
              formattedDate = "유효하지 않은 날짜";
            }
          } catch (error) {
            console.error("Error formatting date:", error);
            formattedDate = "날짜 형식 오류";
          }
        } else {
          formattedDate = "날짜 정보 없음";
        }

        return <div className="font-medium">{formattedDate}</div>;
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
              <AnalysisButton fileId={file.id} fileName={file.file_name} />
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteClick(file.id, file.file_name)}
              // disabled={isDeleting}
            >
              {/*{isDeleting ? "삭제중..." : "삭제"}*/}
              삭제
            </Button>
          </div>
        );
      },
      size: 120,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="파일 이름으로 검색..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <FilesUploadButton session={session} />
      </div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? `${header.getSize()}px`
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} /{" "}
          {table.getFilteredRowModel().rows.length} 행 선택됨.
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground text-sm hover:bg-transparent"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            이전
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-foreground text-sm hover:bg-transparent"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            다음
          </Button>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        itemName={deleteModal.fileName}
        title={`'${deleteModal.fileName}' 파일을 삭제하시겠습니까?`}
        description="이 작업은 되돌릴 수 없으며, 관련된 모든 데이터도 함께 삭제됩니다."
      />
    </div>
  );
}
