import { Router } from "express";
import taskAttachmentController from "./taskAttachment.controller.js";
import { validateParams } from "../../middleware/auth.validation.js";
import { attachmentFileSchema } from "./taskAttachment.validation.js";
import authenticateMiddleware from "../../middleware/authenticate.middleware.js";
import authorizeWorkspaceRole from "../../middleware/authorization.middleware.js";
import upload from "../../middleware/upload.js";

const router = Router();

router.use(authenticateMiddleware.authenticate);

router.post(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/attachments",
  authorizeWorkspaceRole("OWNER", "ADMIN", "MEMBER"),
  upload.single("file"),
  validateParams(attachmentFileSchema),
  taskAttachmentController.createAttachment
);

router.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/attachments",
  authorizeWorkspaceRole("OWNER", "ADMIN", "MEMBER"),
  taskAttachmentController.getAttachmentByTask
);
router.delete(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/attachments/:attachmentId",
  authorizeWorkspaceRole("OWNER", "ADMIN", "MEMBER"),
  taskAttachmentController.deleteAttachment
);

export default router;
