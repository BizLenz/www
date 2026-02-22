"use client";

import * as React from "react";
import {
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { File } from "@/types/file";
import { useRouter } from "next/navigation";
import { FilesUploadButton } from "@/components/files/files-upload-button";
import { useSession } from "next-auth/react";
import { DeleteConfirmationModal } from "@/components/common/delete-confirmation-modal";
import { useFileDelete } from "@/hooks/use-delete-file";
import { createFileColumns } from "@/components/files/files-table-columns";

export function FilesTable({
  data,
  onRefetchFilesAction,
}: {
  data: File[];
  onRefetchFilesAction: () => void;
}) {
  const { data: session } = useSession();
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
  const { mutate: deleteFile } = useFileDelete();

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
        onRefetchFilesAction();
        handleCloseModal();
      } else {
        console.error("File deletion failed:", result);
        toast.error("파일 삭제에 실패했습니다.");
      }
    }
  };

  const handleCloseModal = () => {
    setDeleteModal({ isOpen: false, fileId: undefined, fileName: undefined });
  };

  const columns = createFileColumns({
    router,
    onDeleteClick: handleDeleteClick,
  });

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
        <FilesUploadButton
          session={session}
          onRefetchFilesAction={onRefetchFilesAction}
        />
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
