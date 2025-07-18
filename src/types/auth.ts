import { z } from "zod";

export const backendTokenSchema = z.object({
    token: z.string(),
});

export type BackendTokenResponse = z.infer<typeof backendTokenSchema>;