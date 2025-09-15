import z from "zod";

export const fileSchema = z.object({
  // TODO: add id after DB gets fixed
  // id: z.string(),
  file_name: z.string(),
  last_modified: z.string(),
  size: z.number(),
  status: z.enum(["대기중", "분석중", "완료"]).optional(),
});

export type File = z.infer<typeof fileSchema>;

export type FileStatus = z.infer<typeof fileSchema>["status"];
