import {
  CircleCheck,
  Clock,
  FileQuestionMark,
  LoaderCircle,
  X,
} from "lucide-react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";

type FileStatus = "pending" | "processing" | "completed" | "failed";

interface StatusProps {
  status?: FileStatus;
}

function renderStatus(status?: FileStatus) {
  switch (status) {
    case "completed":
      return (
        <div className="flex items-center gap-2">
          <CircleCheck className="size-4 text-green-500" />
          <span>완료</span>
        </div>
      );
    case "processing":
      return (
        <div className="flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin text-blue-500" />
          <span>분석중</span>
        </div>
      );
    case "pending":
      return (
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground size-4" />
          <span>대기중</span>
        </div>
      );
    case "failed":
      return (
        <div className="flex items-center gap-2">
          <X className="size-4 animate-spin text-blue-500" />
          <span>실패</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2">
          <FileQuestionMark className="text-muted-foreground size-4" />
          <span>Unknown</span>
        </div>
      );
  }
}

export default function StatusBubble({ status }: StatusProps) {
  return <Badge variant="outline">{renderStatus(status)}</Badge>;
}
