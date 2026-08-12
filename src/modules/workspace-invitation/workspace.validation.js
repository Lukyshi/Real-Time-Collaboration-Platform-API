import { z } from 'zod';

export const createWorkspaceInvitationSchema = z.object({
  params : z.object({
    workspaceId : z.uuid(),
  }),
  body : z.object({
    email : z.string().trim().max(50),
    status : z.enum(["PENDING", "ACCEPTED", "EXPIRED", "REJECTED"]).default("PENDING")
  }),
});

