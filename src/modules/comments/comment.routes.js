import { Router } from 'express';
import authMiddleware from '../../middleware/authenticate.middleware.js';
import authorizationMiddleware from '../../middleware/authorization.middleware.js';
import commentController from './comment.controller.js';

const router = Router();

router.use(authMiddleware.authenticate);

router.post('/tasks/:taskId/comments/',
  authorizationMiddleware("OWNER", "ADMIN", "MEMBER"),
  commentController.createComment
);

router.get('/tasks/:taskId/comments/',
  authorizationMiddleware("OWNER", "ADMIN", "MEMBER"),
  commentController.getComment
);

router.get('/tasks/:taskId/comments/:commentId',
  authorizationMiddleware("OWNER", "ADMIN", "MEMBER"),
  commentController.getCommentById
)

router.patch('/tasks/:taskId/comments/:commentId',
  authorizationMiddleware("OWNER", "ADMIN", "MEMBER"),
  commentController.updateComment
);

router.delete('/tasks/:taskId/comments/:commentId', 
  authorizationMiddleware("OWNER", "ADMIN", "MEMBER"),
  commentController.deleteComment
);

export default router;