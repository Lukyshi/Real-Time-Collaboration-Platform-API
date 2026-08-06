import { Router } from "express";
import projectController from "./project.controller.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation.js";
import { validate, updateValidate } from "../../middleware/auth.validation.js";
import authenticateMiddleware from "../../middleware/authenticate.middleware.js";
import authorizeWorkspaceRole from "../../middleware/authorization.middleware.js";

const router = Router();

// untested
router.use(authenticateMiddleware.authenticate);

router.post(
  "/workspaces/:workspaceId/projects",
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  updateValidate(createProjectSchema),
  projectController.createProject,
);
router.get("/workspaces/:workspaceId/projects", projectController.getProjects);
router.get(
  "/workspaces/:workspaceId/projects/:projectId",
  projectController.getProjectById,
);
router.patch(
  "/workspaces/:workspaceId/projects/:projectId",
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  updateValidate(updateProjectSchema),
  projectController.updateProject,
);
router.delete(
  "/workspaces/:workspaceId/projects/:projectId",
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  projectController.deleteProject,
);

export default router;