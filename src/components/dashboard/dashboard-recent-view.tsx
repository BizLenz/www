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

export function DashboardRecentView({ recentFiles }: { recentFiles: File[] }) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border-1 p-5">
      <h2 className="text-2xl font-bold">최근 활동 목록</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground w-[12em]">
              분류
            </TableHead>
            <TableHead className="text-muted-foreground">상태</TableHead>
            <TableHead className="text-muted-foreground text-right">
              파일명
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentFiles.length > 0 ? (
            recentFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">기본분석</TableCell>
                <TableCell>
                  <StatusBubble status={file.status} />
                </TableCell>
                <TableCell className="text-right">{file.file_name}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                최근 활동이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
