import z from "zod";

export const fileSchema = z.object({
  id: z.number(),
  file_name: z.string(),
  last_modified: z.string().optional(),
  size: z.number().optional(),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
});

export type File = z.infer<typeof fileSchema>;

export type FileStatus = z.infer<typeof fileSchema>["status"];
