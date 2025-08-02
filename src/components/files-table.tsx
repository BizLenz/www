"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import {toast, Toaster} from "sonner"
import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import StatusBubble from "@/components/common/status-bubble";
import type {File} from "@/types/file"

export const columns: ColumnDef<File>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllRowsSelected() ||
                    (table.getIsSomeRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
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
        accessorKey: "fileName",
        header: "파일 이름",
        cell: ({row}) => (
            <div className="font-medium">{row.getValue("fileName")}</div>
        ),
    },
    {
        accessorKey: "uploadDate",
        header: "업로드 날짜",
    },
    {
        accessorKey: "status",
        header: "상태",
        cell: ({row}) => {
            const status = row.getValue<File["status"]>("status")
            return <StatusBubble status={status} />;
        },
    },
    {
        id: "actions",
        header: () => null,
        cell: ({row}) => {
            const file = row.original
            const isCompleted = file.status === "완료"

            return (
                <div className="text-right">
                    {isCompleted ? (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                toast.info(
                                    `'${file.fileName}'의 결과 페이지로 이동합니다.`
                                )
                            }
                        >
                            결과확인
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() =>
                                toast.success(`'${file.fileName}' 분석을 요청했습니다.`)
                            }
                        >
                            분석요청
                        </Button>
                    )}
                </div>
            )
        },
        size: 120,
    },
]

export function FilesTable({data}: { data: File[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

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
    })

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="파일 이름으로 검색..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
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
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
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
                                                cell.getContext()
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
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} /{" "}
                    {table.getFilteredRowModel().rows.length} 행 선택됨.
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        className="text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        이전
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-sm text-muted-foreground hover:bg-transparent hover:text-foreground"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        다음
                    </Button>
                </div>
            </div>
        </div>
    )
}

// DUMMY DATA
export default function FilesTablePage() {
    const mockData: File[] = [
        {id: "file1", fileName: "분기별_실적_보고서.pdf", uploadDate: "2025-07-24", status: "완료"},
        {id: "file2", fileName: "프로젝트_알파_기획안.docx", uploadDate: "2025-07-23", status: "대기중"},
        {id: "file3", fileName: "사용자_인터뷰_녹취록.txt", uploadDate: "2025-07-23", status: "대기중"},
        {id: "file4", fileName: "2025년_마케팅_예산안.pdf", uploadDate: "2025-07-22", status: "완료"},
        {id: "file5", fileName: "경쟁사_분석_자료.pdf", uploadDate: "2025-07-21", status: "분석중"},
        {id: "file6", fileName: "신규_기능_요구사항.pdf", uploadDate: "2025-07-20", status: "대기중"},
        {id: "file7", fileName: "서버_로그_20250719.log", uploadDate: "2025-07-19", status: "완료"},
        {id: "file8", fileName: "디자인_시안_v1.pdf", uploadDate: "2025-07-18", status: "완료"},
        {id: "file9", fileName: "고객_피드백_종합.csv", uploadDate: "2025-07-17", status: "분석중"},
        {id: "file10", fileName: "API_명세서_v2.pdf", uploadDate: "2025-07-16", status: "대기중"},
        {id: "file11", fileName: "백엔드_아키텍처.pdf", uploadDate: "2025-07-15", status: "완료"},
        {id: "file12", fileName: "주간_업무_보고.md", uploadDate: "2025-07-14", status: "대기중"},
    ]

    return (
        <div className="container mx-auto py-10">
            <Toaster richColors position="top-right"/>
            <FilesTable data={mockData}/>
        </div>
    )
}