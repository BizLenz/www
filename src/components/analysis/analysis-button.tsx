"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAnalyzeStore } from "@/store/analyze-store";
import { Step1Settings } from "./steps/step-1-settings";
import { Step2Review } from "./steps/step-2-review";

interface AnalysisButtonProps {
  fileId: number;
  fileName: string;
  onConfirm?: (fileId: number) => Promise<void> | void;
}

export function AnalysisButton({
  fileId,
  fileName,
  onConfirm,
}: AnalysisButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);

  const resetFile = useAnalyzeStore((s) => s.resetFile);

  const steps = [
    { title: "분석 옵션 설정", content: <Step1Settings fileId={fileId} /> },
    { title: "최종 확인", content: <Step2Review fileId={fileId} /> },
  ] as const;

  const currentStep = steps[step];

  const handleOpen = () => {
    setStep(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFile(fileId);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (onConfirm) await onConfirm(fileId);
      toast.success(`'${fileName}' 분석을 요청했습니다.`);

      resetFile(fileId);
      //TODO: make call to backend
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("분석 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button size="sm" onClick={handleOpen}>
        분석요청
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentStep.title}</DialogTitle>
            <DialogDescription>
              {step === 0 && "분석 옵션을 설정하세요."}
              {step === 1 && "설정을 확인하고 요청을 완료하세요."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">{currentStep.content}</div>

          <DialogFooter>
            {step > 0 && (
              <Button
                variant="secondary"
                onClick={() => setStep((s) => (s - 1) as 0 | 1)}
                disabled={loading}
              >
                이전
              </Button>
            )}
            {step < steps.length - 1 && (
              <Button
                onClick={() => setStep((s) => (s + 1) as 0 | 1)}
                disabled={loading}
              >
                다음
              </Button>
            )}
            {step === steps.length - 1 && (
              <Button onClick={handleConfirm} disabled={loading}>
                {loading ? "요청 중..." : "확인"}
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
