import { da } from "zod/v4/locales";
import { prisma } from "../../config/prisma.js";

// project :
// the owner or the admin should creata a task and assigned it to a member
//

const createTask = async (workspaceId, projectId, createdById, data) => {
  const project = await prisma.project.findFirst({
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
        assignedToId: data.assignedToId,
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

const getAllTasks = async (workspaceId, projectId, userId) => {
  const tasks = await prisma.task.findMany({
    where: {
      project: {
        workspaceId,
        workspace: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    },
  });

  return tasks;
};

const getTaskById = async (id, workspaceId, projectId, userId) => {
  console.log({
  id,
  projectId,
  workspaceId,
  userId,
});
  const task = await prisma.task.findFirst({
    where: {
      id,
      projectId,
      project: {
        workspaceId,
        workspace: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    },
  });

  if(!task) throw new Error("Task not found");

  return task;

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
