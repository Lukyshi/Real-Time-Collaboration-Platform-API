import { prisma } from "../../config/prisma.js";
import fs from 'fs/promises';
import path from "path";

const createAttachment = async(workspaceId, projectId,taskId, uploadedById, file) => {

  const task = await prisma.task.findFirst({
    where : { 
      id : taskId,
      projectId,
      project : {
        workspaceId
      }
    }
  });

  if(!task) throw new Error("Task not found");

  const attachment = await prisma.taskAttachment.create({
    data : {
      taskId,
      uploadedById,
      fileName : file.originalname,
      fileUrl : `uploads/${file.filename}`,
      fileSize : file.size,
      mimeType : file.mimetype,
    },
  }); 

  return attachment;

};

const getAttachmentByTask = async(workspaceId, projectId, taskId) => {
  const task =  await prisma.task.findFirst({
    where : {
      id : taskId,
      projectId,
      project : {
        workspaceId
      }
    }
  });

  if(!task) throw new Error("Task not found");

  return await prisma.taskAttachment.findMany({
    where : { taskId : taskId },
    orderBy : { createdAt : "asc" }
  });

};

const deleteAttachment = async(workspaceId, projectId, taskId, attachmentId) => {

  const attachment = await prisma.taskAttachment.findFirst({
    where : { 
      id : attachmentId,
      taskId,
      task : {
        projectId,
        project : {
          workspaceId
        },
      },
    },
  });

  if(!attachment) throw new Error('Attachment Not Found');

  const filePath = path.join(process.cwd(), attachment.fileUrl);
  try {
    await fs.unlink(filePath);
  }catch(err) {
    console.warn(`Could not delete file from disk: ${filePath}`, err.message);
  }

  await prisma.taskAttachment.delete({
    where : { id : attachmentId },
  });  
};

export default {
  createAttachment,
  getAttachmentByTask,
  deleteAttachment
}
