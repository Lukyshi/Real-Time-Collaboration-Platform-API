import { success } from "zod";
import commentService from "./comment.service.js";

const createComment = async(req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const comment = await commentService.createComment(taskId, userId, req.body);

    res.status(201).json({
      success : true,
      data : comment,
    });
    
  }catch(error) {
    next(error);
  }
};

const getComment = async(req, res, next) => {
  try {
    const { taskId } = req.params;

    const comment = await commentService.getComments(taskId);

    res.status(200).json({
      success : true,
      data : comment,
    });

  }catch(error) {
    next(error);
  }
};

const getCommentById = async(req, res, next) => {
  try {

    const {taskId, commentId} = req.params;

    const comment = await commentService.getCommentById(taskId, commentId);

    res.status(200).json({
      success : true,
      data : comment,
    });

  }catch(error){
    next(error);
  }
};

const updateComment = async(req, res, next) => {
  try {
    const {taskId, commentId } = req.params;
    
    const comment = await commentService.updateComment(taskId, commentId, req.body);

    res.status(200).json({
      success : true,
      data : comment,
    });

  }catch(error) {
    next(error);
  }
};

const deleteComment = async(req, res, next) => {
  try {
    const {taskId, commentId } = req.params;

    await commentService.deleteComment(taskId, commentId);

    res.status(200).json({
      success : true,
      message : "Comment deleted successfully",
    });

  }catch(error) {
    next(error);
  }
};

export default {
  createComment,
  getComment,
  getCommentById,
  updateComment,
  deleteComment
}
