import z from "zod";

export const fileSchema = z.object({
  id: z.number(),
  file_name: z.string(),
  file_path: z.string(),
  mime_type: z.string().optional(),
  file_size: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  latest_job_id: z.number().nullish(),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
});

export type File = z.infer<typeof fileSchema>;

export type FileStatus = z.infer<typeof fileSchema>["status"];
