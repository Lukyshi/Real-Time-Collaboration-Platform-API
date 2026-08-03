import { z } from 'zod';

export const createWorkspaceSchema = z.object({
    name : z.string().trim().min(3, 'Workspace name must be at least 3 characters').max(50, 'Workspace cannot be exceed 50 characters'),
    description : z.string().trim().max(500, 'Description cannot be exceed 500 characters')
});

export const updateWorkspaceSchema = z.object({
  params : z.object({
    workspaceId : z.uuid(),
  }),

  body : z.object({
    name : z.string().trim().min(3).max(50).optional(),
    description : z.string().trim().max(500).nullable().optional()
  }),
});
