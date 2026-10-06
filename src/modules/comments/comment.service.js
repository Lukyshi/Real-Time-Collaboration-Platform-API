import { prisma } from "../../config/prisma.js";

const getComments = async (taskId) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    select: {
      project: {
        select: {
          workspaceId: true,
        },
      },
    },
  });

  if (!task) throw new Error("Task not found");

  return await prisma.taskComment.findMany({
    where: { taskId },
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const getCommentById = async (taskId, commentId) => {
  const comment = await prisma.taskComment.findFirst({
    where : {
      id : commentId,
      taskId,
    },
    select : {
      task : {
        select : {
          project : {
            select : {
              workspaceId : true,
            },
          },
        },
      },
    },
    select : {
      id :  true,
      content : true,
      createdAt : true,
      updatedAt : true,
      user : {
        select : {
          id : true,
          name : true,
        }
      }
    }
  });

  return comment;

};

const createComment = async (taskId, userId, data) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      project: {
        select: {
          workspaceId: true,
        },
      },
    },
  });

  if (!task) throw new Error("Task not found");

  return await prisma.taskComment.create({
    data: {
      taskId: taskId,
      userId: userId,
      content: data.content,
    },
  });
};

const updateComment = async (taskId, commentId, data) => {
  const comment = await prisma.taskComment.findFirst({
    where: {
      id: commentId,
      taskId,
    },
    select: {
      task: {
        select: {
          project: {
            select: {
              workspaceId: true,
            },
          },
        },
      },
    },
  });

  if (!comment) throw new Error("Comment not found");

  return await prisma.taskComment.update({
    where: { id: commentId },
    data: {
      content: data.content,
    },
  });
};

const deleteComment = async (taskId, commentId) => {
  const comment = await prisma.taskComment.findFirst({
    where: {
      id: commentId,
      taskId,
    },
    select: {
      task: {
        select: {
          project: {
            select: {
              workspaceId: true,
            },
          },
        },
      },
    },
  });

  if (!comment) throw new Error("Comment not found");

  return await prisma.taskComment.delete({
    where: { id: commentId },
  });
};

export default {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
};
