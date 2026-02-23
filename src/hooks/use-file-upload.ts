import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { API_ENDPOINTS } from "@/config/api";
import { authenticatedFetch } from "@/lib/api-client";
import { useBackendToken } from "@/hooks/use-backend-token";
import { authClient } from "@/lib/auth-client";

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

function validatePdfFile(
  file: File | null,
  accessToken: string | undefined | null,
): string | null {
  if (!accessToken) return "Not authenticated.";
  if (!file) return "No file selected.";
  if (!file.name.toLowerCase().endsWith(".pdf"))
    return "Only PDF files are allowed.";
  if (file.type.toLowerCase() !== "application/pdf")
    return "'application/pdf' MIME type only is allowed.";
  return null;
}

const VALIDATION_TOASTS: Record<string, string> = {
  "Not authenticated.": "로그인 후에 파일을 업로드할 수 있습니다.",
  "No file selected.": "업로드할 파일을 선택해주세요.",
  "Only PDF files are allowed.": "PDF 파일만 업로드 가능합니다.",
  "'application/pdf' MIME type only is allowed.":
    "'application/pdf' MIME 타입만 허용됩니다.",
};

async function getPresignedUrl(
  token: string,
  file: File,
  userId: string | undefined,
  description: string,
): Promise<PresignedUrlResponse> {
  const { data, error } = await authenticatedFetch<PresignedUrlResponse>(
    API_ENDPOINTS.files.upload,
    token,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        description,
      }),
    },
  );

  if (error || !data)
    throw new Error(error?.detail ?? "Failed to get presigned URL");
  return data;
}

async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok)
    throw new Error(`Failed to upload file to S3: ${response.statusText}`);
}

async function saveFileMetadata(
  token: string,
  file: File,
  presigned: PresignedUrlResponse,
  userId: string | undefined,
  description: string,
): Promise<MetadataSaveResponse> {
  const { data, error } = await authenticatedFetch<MetadataSaveResponse>(
    API_ENDPOINTS.files.uploadMetadata,
    token,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        file_name: file.name,
        mime_type: file.type,
        key: presigned.key,
        file_url: presigned.file_url,
        size: file.size,
        file_size: file.size,
        s3_key: presigned.key,
        s3_file_url: presigned.file_url,
        description,
      }),
    },
  );

  if (error || !data)
    throw new Error(error?.detail ?? "Failed to save file metadata");
  return data;
}

export const useFileUpload = (options?: FileUploadOptions): UseFileUpload => {
  const session = authClient.useSession();
  const { fastApiToken } = useBackendToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File): Promise<FileUploadResult | undefined> => {
      setError(null);
      setLoading(true);

      const validationError = validatePdfFile(file, fastApiToken);
      if (validationError) {
        toast.error(VALIDATION_TOASTS[validationError] ?? validationError);
        setError(validationError);
        setLoading(false);
        return;
      }

      const token = fastApiToken!;
      const userId = session.data?.user?.id;
      const description = options?.description ?? "Uploaded via useFileUpload";

      try {
        const presigned = await getPresignedUrl(
          token,
          file,
          userId,
          description,
        );
        await uploadToS3(presigned.presigned_url, file);
        const metadata = await saveFileMetadata(
          token,
          file,
          presigned,
          userId,
          description,
        );

        toast.success(`Upload successful! File ID: ${metadata.file_id}.`);
        return {
          fileId: metadata.file_id,
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
    [session.data, fastApiToken, options?.description],
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { uploadFile, loading, error, reset };
};
