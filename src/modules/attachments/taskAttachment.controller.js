import taskAttachmentService from "./taskAttachment.service.js";

const createAttachment = async(req, res, next) => {
  try {
    const { workspaceId, projectId, taskId } = req.params;
    const uploadedById = req.user.id;
    const file  = req.file;

    const attachment = await taskAttachmentService.createAttachment(workspaceId, projectId, taskId, uploadedById, file);

    res.status(201).json({
      success : true,
      data : attachment,
    });

  }catch(error) {
    next(error);
  }
};

const getAttachmentByTask = async(req, res, next) => {
  try {
    const { workspaceId, projectId, taskId } = req.params;

    const attachment = await taskAttachmentService.getAttachmentByTask(workspaceId, projectId, taskId);

    res.status(200).json({
      success : true,
      data : attachment,
    });

  }catch(error) {
    next(error);
  }
};

const deleteAttachment = async(req, res, next) => {
  try {
    const { workspaceId, projectId, taskId, attachmentId } = req.params;

    await taskAttachmentService.deleteAttachment(workspaceId, projectId, taskId, attachmentId);

    res.status(200).json({
      success : true,
      message : "Task attachment deleted successfully",
    });

  }catch(error) {
    next(error);
  }
};

export default {
  createAttachment,
  getAttachmentByTask,
  deleteAttachment
}
