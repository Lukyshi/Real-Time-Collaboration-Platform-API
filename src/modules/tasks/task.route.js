import { Router } from "express";
import taskController from "./task.controller.js";
import { validate, updateValidate } from "../../middleware/auth.validation.js";
import { createTaskSchema, updateTaskschema } from "./task.validation.js";
import authenticateMiddleware from "../../middleware/authenticate.middleware.js";
import authorizeWorkspaceRole from "../../middleware/authorization.middleware.js";

const router = Router();

router.use(authenticateMiddleware.authenticate);

router.post(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  updateValidate(createTaskSchema),
  taskController.createTask,
);

router.get("/workspaces/:workspaceId/projects/:projectId/tasks", taskController.getAllTasks);
router.get("/workspaces/:workspaceId/projects/:projectId/tasks/:taskId", taskController.getTaskById);
router.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  updateValidate(updateTaskschema),
  taskController.updateTask,
);
router.delete(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId",
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  taskController.deleteTask,
);

export default router;
