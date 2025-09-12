import { z } from "zod";

// --- GET /api/files/search Response ---

export const apiFileSearchItemSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const apiFilesSearchResponseSchema = z.object({
  status: z.string(), // "success", ...
  results: z.array(apiFileSearchItemSchema),
});

export type ApiFileSearchItem = z.infer<typeof apiFileSearchItemSchema>;
export type ApiFilesSearchResponse = z.infer<
  typeof apiFilesSearchResponseSchema
>;

// --- POST /api/files/upload Request/Response ---

export const apiFileUploadRequestSchema = z.object({
  user_id: z.string(),
  file_name: z.string(),
  mime_type: z.string(),
  file_size: z.number(),
  description: z.string().optional(),
});
export type ApiFileUploadRequest = z.infer<typeof apiFileUploadRequestSchema>;

export const apiFileUploadResponseSchema = z.object({
  user_id: z.string(),
  file_name: z.string(),
  mime_type: z.string(),
  file_size: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  success: z.boolean(),
  message: z.string().optional(),
  presigned_url: z.string().optional(),
});
export type ApiFileUploadResponse = z.infer<typeof apiFileUploadResponseSchema>;
