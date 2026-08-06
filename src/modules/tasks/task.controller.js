import { success } from "zod";
import taskService from "./task.service.js";

const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const createdById = req.user.id;
    const assignedToId = req.user.id;

    const task = await taskService.createTask(
      projectId,
      createdById,
      assignedToId,
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
    const userId = req.user.id;

    const task = await taskService.getAllTasks(userId);

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
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await taskService.getTaskById(taskId, userId);

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
    const { taskId, projectId } = req.params;

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
