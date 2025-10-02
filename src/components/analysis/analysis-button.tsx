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
import { type FileSettings, useAnalyzeStore } from "@/store/analysis-store";
import { Step1Settings } from "./steps/step-1-settings";
import { Step2Review } from "./steps/step-2-review";
import { useAnalysis } from "@/hooks/use-analysis-hook";
import { useFileStore } from "@/store/file-store";

interface AnalysisButtonProps {
  fileId: number;
  onConfirm?: (fileId: number) => Promise<void> | void;
}

export function AnalysisButton({ fileId, onConfirm }: AnalysisButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<0 | 1>(0);

  const fileStore = useFileStore();

  const EMPTY_SETTINGS: FileSettings = {};

  const settings = useAnalyzeStore((s) => s.files[fileId] ?? EMPTY_SETTINGS);

  const resetFile = useAnalyzeStore((s) => s.resetFile);

  const { analyzeDocument, isLoading, error, resetError } = useAnalysis();

  const steps = [
    { title: "분석 옵션 설정", content: <Step1Settings fileId={fileId} /> },
    { title: "최종 확인", content: <Step2Review fileId={fileId} /> },
  ] as const;

  const currentStep = steps[step];

  const handleOpen = () => {
    setStep(0);
    setOpen(true);
    resetError();
  };

  const handleClose = () => {
    setOpen(false);
    resetFile(fileId);
    resetError();
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (onConfirm) await onConfirm(fileId);

      const file = fileStore.files.find((f) => f.id === fileId);

      if (!file) {
        toast.error("File not found.");
        return;
      }

      toast.success(`'${file.file_name}' 분석을 요청했습니다.`);

      resetFile(fileId);

      const request = {
        file_path: file.file_path,
        // TODO: update default after backend changes
        contest_type: settings.contestType ?? "예비창업패키지",
      };

      const result = await analyzeDocument(request);

      if (result) {
        // TODO: move user to analysis result page
        toast.success(`'${file.file_name}' 분석을 완료했습니다.`);
      }

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
