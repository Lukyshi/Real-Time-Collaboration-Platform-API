import { z } from "zod";

export const attachmentFileSchema = z.object({
    taskId: z.uuid(),
});
