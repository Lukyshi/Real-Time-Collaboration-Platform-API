import { da } from "zod/v4/locales";
import { prisma } from "../../config/prisma.js";

// project :
// the owner or the admin should creata a task and assigned it to a member
//

const createTask = async (projectId, createdById, assignedToId, data) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("project not found");

  const createTask = await prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        status: data.status || "TODO",
        priority: data.priority || "LOW",
        due_date: data.due_date,
        assignedToId,
        createdById,
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId,
        userId: createdById,
        action: "CREATE_TASK",
        entityType: "TASK",
        entityId: task.id,
      },
    });

    return task;
  });

  return createTask;
};

const getAllTasks = async (userId) => {
  const tasks = await prisma.task.findMany({
    where: {
      project: {
        workspace: {
          some: {
            userId,
          },
        },
      },
    },
  });

  return tasks;
};

const getTaskById = async (id, userId) => {
  const tasks = await prisma.task.findFirst.apply({
    where: {
      id,
      project: {
        workspace: {
          some: {
            userId,
          },
        },
      },
      data: {
        projectId: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        due_date: true,
        assignedToI: true,
        createdById: true,
      },
    },
  });

  return tasks;
};

const updateTask = async (id, projectId, data) => {
  const findTask = await prisma.task.findFirst({
    where: { id, projectId: projectId },
  });

  if (!findTask) throw new Error("Task not found in this project");

  const updateTask = await prisma.$transaction(async (tx) => {
    const task = await tx.task.create({
      data: {
        projectId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
      },
    });

    await tx.activityLog.create({
      data: {
        workspaceId,
        userId,
        action: "UPDATE_TASK",
        entityType: "TASK",
        entityId: task.id,
      },
    });

    return task;
  });

  return updateTask;
};

const deleteTask = async (id, projectId) => {
  const findTask = await prisma.task.findFirst({
    where: {
      id,
      projectId: projectId,
    },
  });

  if (!findTask) throw new Error("Task not found in this project");

  const deleteTask = await prisma.$transaction(async (tx) => {
    const task = await tx.task.delete({
      where: { id },
    });

    await tx.activityLog.create({
      data: {
        workspaceId,
        userId,
        action: "DELETE_TASK",
        entityType: "TASK",
        entityId: task.id,
      },
    });

    return task;
  });
  return deleteTask;
};

export default {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
