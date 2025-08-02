import z from "zod";

export const fileSchema = z.object({
    id: z.string(),
    fileName: z.string(),
    uploadDate: z.string(),
    status: z.enum(["대기중", "분석중", "완료"]),
})

export type File = z.infer<typeof fileSchema>;

export type FileStatus = z.infer<typeof fileSchema>["status"];