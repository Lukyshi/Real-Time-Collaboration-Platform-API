import { success } from "zod";
import taskService from "./task.service.js";
import { use } from "react";

const createTask = async (req, res, next) => {
  try {
    const { workspaceId, projectId } = req.params;
    const createdById = req.user.id;

    const task = await taskService.createTask(
      workspaceId,
      projectId,
      createdById,
      req.body,
    );

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const { projectId, workspaceId } = req.params;
    const userId = req.user.id;

    const task = await taskService.getAllTasks(workspaceId, projectId, userId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const { taskId, workspaceId, projectId } = req.params;
    const userId = req.user.id;

    const task = await taskService.getTaskById(taskId, workspaceId, projectId, userId);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { taskId, projectId } = req.params;

    const task = await taskService.updateTask(taskId, projectId, req.body);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId, projectId} = req.params;

    const task = await taskService.deleteTask(taskId, projectId);

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
