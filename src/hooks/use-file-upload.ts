import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";

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

interface FileUploadErrorResponse {
  detail: string;
}

export const useFileUpload = (options?: FileUploadOptions): UseFileUpload => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult | undefined> => {
      setError(null); // Clear previous errors
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

      // File validation
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
        // Get Presigned URL from Backend
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
              file_name: file.name,
              mime_type: file.type,
              file_size: file.size,
              description: options?.description ?? "Uploaded via useFileUpload",
            }),
          },
        );

        if (!presignedUrlResponse.ok) {
          const errorData =
            (await presignedUrlResponse.json()) as FileUploadErrorResponse;
          console.error("Backend Error Details:", errorData);
          const errorMessage =
            errorData.detail ??
            `Failed to get presigned URL: ${presignedUrlResponse.status}`;
          throw new Error(errorMessage);
        }

        const { presigned_url, file_url, key } =
          (await presignedUrlResponse.json()) as PresignedUrlResponse;
        console.log("Presigned URL received. Uploading to S3...");

        // Upload the file directly to S3
        const s3UploadResponse = await fetch(presigned_url, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!s3UploadResponse.ok) {
          throw new Error(
            `Failed to upload file to S3: ${s3UploadResponse.statusText}`,
          );
        }

        console.log("File successfully uploaded to S3. Saving metadata...");

        // Notify Backend to save file metadata
        const metadataSaveResponse = await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/files/upload/metadata", // Use env var
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: session.user?.id,
              file_name: file.name,
              mime_type: file.type,
              key: key,
              file_url: file_url,
              size: file.size,
              file_size: file.size,
              s3_key: key,
              s3_file_url: file_url,
              description: options?.description ?? "Uploaded via useFileUpload",
            }),
          },
        );

        if (!metadataSaveResponse.ok) {
          const errorData =
            (await metadataSaveResponse.json()) as FileUploadErrorResponse;
          const errorMessage =
            errorData.detail ??
            `Failed to save file metadata: ${metadataSaveResponse.status}`;
          throw new Error(errorMessage);
        }

        const metadataResult =
          (await metadataSaveResponse.json()) as MetadataSaveResponse;
        toast.success(`Upload successful! File ID: ${metadataResult.file_id}.`);
        return {
          fileId: metadataResult.file_id,
          fileUrl: file_url,
          s3Key: key,
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
