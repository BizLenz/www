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

interface FilesUploadButtonProps {
  fileId: string;
  fileName: string;
  session: Session | null;
  onConfirm?: (fileId: string) => Promise<void> | void;
}

export function FilesUploadButton({
  fileId,
  fileName,
  onConfirm,
  session,
}: FilesUploadButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[] | undefined>();

  const uploadFile = async () => {
    if (!session?.accessToken) {
      toast.error("로그인 후에 파일을 업로드할 수 있습니다.");
      return;
    }

    if (!files || files.length === 0) {
      toast.error("업로드할 파일을 선택해주세요.");
      return;
    }

    if (!files[0]?.name.toLowerCase().endsWith(".pdf")) {
      toast.error("PDF 파일만 업로드 가능합니다.");
      return;
    }
    if (files[0]?.type.toLowerCase() !== "application/pdf") {
      toast.error("'application/pdf' MIME 타입만 허용됩니다.");
      return;
    }

    try {
      const presignedUrlResponse = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/files/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session.user?.id,
            file_name: files[0].name,
            mime_type: files[0].type,
            file_size: files[0].size,
            description: "Uploaded via Dev",
          }),
        },
      );
      if (!presignedUrlResponse.ok) {
        const errorData = await presignedUrlResponse.json();
        console.error("FastAPI 422 Error Details:", errorData);
        throw new Error(
          errorData.detail ||
            `Failed to get presigned URL: ${presignedUrlResponse.status}`,
        );
      }

      const { upload_url, file_url, key } = await presignedUrlResponse.json();
      console.log("Presigned URL received. Uploading to S3...");

      // Upload the file directly to S3 using the presigned URL
      const s3UploadResponse = await fetch(upload_url, {
        method: "PUT",
        headers: {
          "Content-Type": files[0].type,
          // the URL itself contains the authentication
        },
        body: files[0],
      });

      if (!s3UploadResponse.ok) {
        throw new Error(
          `Failed to upload file to S3: ${s3UploadResponse.statusText}`,
        );
      }

      console.log("File successfully uploaded to S3. Saving metadata...");

      // Notify FastAPI backend to save file metadata in RDS
      const metadataSaveResponse = await fetch(
        "http://localhost:8000/files/upload/metadata",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: session.user?.id,
            file_name: files[0].name, // Original name
            mime_type: files[0].type,
            key: key, // S3 key from the presigned URL response
            file_url: file_url, // Full S3 URL from the presigned URL response
            size: files[0].size,
            file_size: files[0].size,
            s3_key: key,
            s3_file_url: file_url,
            description: "Uploaded via Dev",
          }),
        },
      );

      if (!metadataSaveResponse.ok) {
        const errorData = await metadataSaveResponse.json();
        throw new Error(
          errorData.detail ||
            `Failed to save file metadata: ${metadataSaveResponse.status}`,
        );
      }

      const metadataResult = await metadataSaveResponse.json();
      toast.success(`Upload successful! File ID: ${metadataResult.file_id}.`);
      setFiles([]); // Clear selected file
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message);
      setFiles([]);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (onConfirm) await onConfirm(fileId);
      toast.success(`'${fileName}'업로드를 시작합니다.`);

      void uploadFile();
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error("업로드 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (file: File[]) => {
    console.log(files);
    setFiles(files);
  };

  return (
    <>
      <Button size="sm" onClick={handleOpen}>
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
            accept={{ "pdf/": [] }}
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
