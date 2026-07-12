import { z } from 'zod';

export const addMemberSchema = z.object({
  params : z.object({
    workspaceId : z.uuid(),
    role : z.enum([ "OWNER", "ADMIN", "MEMBER" ]).default("MEMBER")
  })
});

export const updateMemberSchema = z.object({
  params : z.object({
    workspaceId : z.uuid(),
    userId : z.uuid()
  }),

  body : z.object({
    role : z.enum(["OWNER", "ADMIN", "MEMBER"])
  })
});