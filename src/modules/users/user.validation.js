import { z } from "zod";

export const updatedProfileSchema = z.object({
  name : z.string().min(2, "Name is too short")
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6, "Old password is invalid"),
  newPassword : z.string().min(6, "New password is too short")
});
