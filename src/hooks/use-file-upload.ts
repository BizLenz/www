import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api-client";

interface FileUploadOptions {
  description?: string;
}

interface FileUploadResult {
  fileId: number;
  fileUrl: string;
  s3Key: string;
}

interface UseFileUpload {
  uploadFile: (file: File) => Promise<FileUploadResult | undefined>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

interface PresignedUrlResponse {
  presigned_url: string;
  file_url: string;
  key: string;
}

interface MetadataSaveResponse {
  message: string;
  file_id: number;
}

export const useFileUpload = (options?: FileUploadOptions): UseFileUpload => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult | undefined> => {
      setError(null);
      setLoading(true);

      if (!session?.accessToken) {
        toast.error("로그인 후에 파일을 업로드할 수 있습니다.");
        setError("Not authenticated.");
        setLoading(false);
        return;
      }

      if (!file) {
        toast.error("업로드할 파일을 선택해주세요.");
        setError("No file selected.");
        setLoading(false);
        return;
      }

      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("PDF 파일만 업로드 가능합니다.");
        setError("Only PDF files are allowed.");
        setLoading(false);
        return;
      }
      if (file.type.toLowerCase() !== "application/pdf") {
        toast.error("'application/pdf' MIME 타입만 허용됩니다.");
        setError("'application/pdf' MIME type only is allowed.");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Get presigned URL from backend
        const { data: presigned, error: presignedError } =
          await authenticatedFetch<PresignedUrlResponse>(
            API_ENDPOINTS.files.upload,
            session.accessToken,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: session.user?.id,
                file_name: file.name,
                mime_type: file.type,
                file_size: file.size,
                description:
                  options?.description ?? "Uploaded via useFileUpload",
              }),
            },
          );

        if (presignedError || !presigned)
          throw new Error(
            presignedError?.detail ?? "Failed to get presigned URL",
          );

        // Step 2: Upload file directly to S3
        const s3UploadResponse = await fetch(presigned.presigned_url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!s3UploadResponse.ok)
          throw new Error(
            `Failed to upload file to S3: ${s3UploadResponse.statusText}`,
          );

        // Step 3: Notify backend to save file metadata
        const { data: metadataResult, error: metadataError } =
          await authenticatedFetch<MetadataSaveResponse>(
            API_ENDPOINTS.files.uploadMetadata,
            session.accessToken,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id: session.user?.id,
                file_name: file.name,
                mime_type: file.type,
                key: presigned.key,
                file_url: presigned.file_url,
                size: file.size,
                file_size: file.size,
                s3_key: presigned.key,
                s3_file_url: presigned.file_url,
                description:
                  options?.description ?? "Uploaded via useFileUpload",
              }),
            },
          );

        if (metadataError || !metadataResult)
          throw new Error(
            metadataError?.detail ?? "Failed to save file metadata",
          );

        toast.success(
          `Upload successful! File ID: ${metadataResult.file_id}.`,
        );
        return {
          fileId: metadataResult.file_id,
          fileUrl: presigned.file_url,
          s3Key: presigned.key,
        };
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        toast.error(errorMessage);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [session, options?.description],
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { uploadFile, loading, error, reset };
};
