"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {toast} from "sonner";

interface AnalyzeButtonProps {
    fileName: string;
    onConfirm?: () => Promise<void> | void; // TODO: add extra function (API call, ...)
}

export function AnalyzeButton({
                                         fileName,
                                         onConfirm,
                                     }: AnalyzeButtonProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);

            // Run API call logic sent from the outside
            if (onConfirm) {
                await onConfirm();
            }

            toast.success(`'${fileName}' 분석을 요청했습니다.`);
        } catch (error) {
            console.error(error);
            toast.error("분석 요청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <Button size="sm" onClick={() => setOpen(true)}>
                분석요청
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>분석 요청</DialogTitle>
                        <DialogDescription>
                            {`'${fileName}' 파일에 대한 분석을 요청하시겠습니까?`}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="secondary"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            취소
                        </Button>
                        <Button onClick={handleConfirm} disabled={loading}>
                            {loading ? "요청 중..." : "확인"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}