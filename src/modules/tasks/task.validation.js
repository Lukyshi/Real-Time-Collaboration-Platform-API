import { z } from "zod";

export const createTaskSchema = z.object({
  params: z.object({
    projectId: z.uuid(),
    workspaceId : z.uuid()
  }),
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
    
    assignedToId : z.uuid().optional(),
    status : z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).default("TODO"),
    priority : z.enum(["LOW", "MEDIUM", "HIGH", "URGENT" ]).default("LOW")
    
  }),
});

export const updateTaskschema = z.object({
  params: z.object({
    taskId: z.uuid(),
    projectId: z.uuid(),
    workspaceId : z.uuid()
  }),
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

    status : z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).default("TODO"),
    priority : z.enum(["LOW", "MEDIUM", "HIGH", "URGENT" ]).default("LOW"),
    assignedToId : z.uuid().optional()
  
  }),
});
