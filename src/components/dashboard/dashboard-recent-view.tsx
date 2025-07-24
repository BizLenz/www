import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export function DashboardRecentView() {
    return (<div className="flex flex-col gap-4 border-1 rounded-xl p-5 h-full">
        <h2 className="text-2xl font-bold">최근 활동 목록</h2>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[12em] text-muted-foreground">분류</TableHead>
                    <TableHead className="text-muted-foreground">상태</TableHead>
                    <TableHead className="text-right text-muted-foreground">파일명</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* TODO: fetch from backend */}
                <TableRow>
                    <TableCell className="font-medium">기본분석</TableCell>
                    <TableCell>완료</TableCell>
                    <TableCell className="text-right">A_LOREM_IPSUM.pdf</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>)
}