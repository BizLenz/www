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
import type { Session } from "next-auth";
import { useFileUpload } from "@/hooks/use-file-upload";

interface FilesUploadButtonProps {
  session: Session | null;
}

export function FilesUploadButton({ session }: FilesUploadButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[] | undefined>();
  const { uploadFile, error, reset } = useFileUpload({
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
      const result = await uploadFile(file);
      if (result) {
        console.log("File uploaded successfully:", result);
      }
      toggleOpen();
    } catch (error) {
      console.error(error);
      toast.error("업로드 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (file: File[]) => {
    console.log(file);
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
          {/* TODO: Check backend for actual size limits */}
          <Dropzone
            accept={{ "application/pdf": [] }}
            maxSize={1024 * 1024 * 50}
            minSize={1024}
            onDrop={handleDrop}
            onError={console.error}
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
