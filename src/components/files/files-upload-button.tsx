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
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";

import { useFileUpload } from "@/hooks/use-file-upload";

interface FilesUploadButtonProps {
  onRefetchFilesAction: () => void;
}

export function FilesUploadButton({
  onRefetchFilesAction,
}: FilesUploadButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[] | undefined>();
  const { uploadFile } = useFileUpload({
    description: "User uploaded document",
  });

  const toggleOpen = () => {
    setOpen(!open);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      toast.success(`업로드를 시작합니다.`);
      if (!files || files.length === 0) {
        toast.error("No file selected.");
        return;
      }
      const file = files[0];
      if (!file) {
        toast.error("No file selected.");
        return;
      }
      await uploadFile(file);
      setFiles(undefined);
      onRefetchFilesAction();
      toggleOpen();
    } catch {
      toast.error("업로드 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (file: File[]) => {
    setFiles(file);
  };

  return (
    <>
      <Button size="sm" onClick={toggleOpen}>
        업로드
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>파일 업로드</DialogTitle>
            <DialogDescription>원하는 파일을 선택해주세요. </DialogDescription>
          </DialogHeader>
          <Dropzone
            accept={{ "application/pdf": [] }}
            maxSize={1024 * 1024 * 50} // 50MB
            minSize={1024}
            onDrop={handleDrop}
            onError={() => toast.error("파일 처리 중 오류가 발생했습니다.")}
            src={files}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>

          <DialogFooter>
            <Button onClick={handleConfirm} disabled={loading}>
              {loading ? "요청 중..." : "업로드"}
            </Button>
            <Button variant="secondary" onClick={toggleOpen} disabled={loading}>
              취소
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
