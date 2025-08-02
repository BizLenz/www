import {CircleCheck, Clock, LoaderCircle} from "lucide-react";
import * as React from "react";
import {Badge} from "@/components/ui/badge";

type FileStatus = "완료" | "분석중" | "대기중";

interface StatusProps {
    status: FileStatus | string;
}

function renderStatus(
    status: FileStatus | string
) {
    switch (status) {
        case "완료":
            return (
                <div className="flex items-center gap-2">
                    <CircleCheck className="size-4 text-green-500"/>
                    <span>{status}</span>
                </div>
            )
        case "분석중":
            return (
                <div className="flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin text-blue-500"/>
                    <span>{status}</span>
                </div>
            )
        case "대기중":
            return (
                <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground size-4"/>
                    <span>{status}</span>
                </div>
            )
        default:
            return <span>{status}</span>
    }
}

export default function StatusBubble({status}: StatusProps) {
    return (<Badge variant="outline">{renderStatus(status)}</Badge>);
}