import { z } from "zod";

export const createTaskSchema = z.object({
  params: {
    projectId: z.uuid(),
  },
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "task title must be 3 character at least")
      .max(50, "task title must not exceed in 50 characters"),
    description: z
      .string()
      .trim()
      .max(500, "task description must not exceed in 50 characters")
      .optional(),
  }),
});

export const updateTaskschema = z.object({
  params : {
    taskId : z.uuid(),
    projectId : z.uuid(),
  },
  body : {
      title: z
      .string()
      .trim()
      .min(3, "task title must be 3 character at least")
      .max(50, "task title must not exceed in 50 characters"),
    description: z
      .string()
      .trim()
      .max(500, "task description must not exceed in 50 characters")
      .optional(),
  }
});
