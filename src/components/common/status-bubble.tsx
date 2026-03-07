import {
  CircleCheck,
  Clock,
  FileQuestionMark,
  LoaderCircle,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type FileStatus = "pending" | "processing" | "completed" | "failed";

const STATUS_CONFIG: Record<
  FileStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  completed: { label: "완료", icon: CircleCheck, className: "text-green-500" },
  processing: {
    label: "분석중",
    icon: LoaderCircle,
    className: "animate-spin text-blue-500",
  },
  pending: { label: "대기중", icon: Clock, className: "text-muted-foreground" },
  failed: { label: "실패", icon: X, className: "text-destructive" },
};

export default function StatusBubble({ status }: { status?: FileStatus }) {
  if (!status || !(status in STATUS_CONFIG)) {
    return (
      <Badge variant="outline">
        <div className="flex items-center gap-2">
          <FileQuestionMark className="text-muted-foreground size-4" />
          <span>Unknown</span>
        </div>
      </Badge>
    );
  }

  const { label, icon: Icon, className } = STATUS_CONFIG[status];

  return (
    <Badge variant="outline">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${className}`} />
        <span>{label}</span>
      </div>
    </Badge>
  );
}
