import { z } from "zod";

export const createProjectSchema = z.object({
  params: z.object({
    workspaceId: z.uuid(),
  }),
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Project name must at least 3 characters")
      .max(50, "Project name cannot be exceed 50 characters"),
    description: z
      .string()
      .trim()
      .max(500, "Description cannot be exceed 500 characters")
      .optional(),
  }),
});

export const updateProjectSchema = z.object({
  params: z.object({
    projectId: z.uuid(),
    workspaceId : z.uuid()
  }),
  body: z.object({
    name: z.string().trim().min(3).max(50).optional(),
    description: z.string().trim().max(500).nullable().optional(),
  }),
});
