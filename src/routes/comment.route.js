const express = require('express');

//* Controllers
const commentController = require('../controllers/commment.controller');

//* Middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const commentMiddleware = require('../middlewares/comment.middleware');
const validationsMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

//? protect all routes
router.use(authMiddleware.protect);

//* routes
router.route('/').get(commentController.findAllComments)

router.post(
  '/:postId',
  validationsMiddleware.createCommentValidation,
  commentController.createComment
);

router
  .use('/:id', commentMiddleware.validComment)
  .route('/:id')
  .get(commentController.getById)
  .patch(
    validationsMiddleware.updateCommentValidation,
    commentController.updateComment
  )
  .delete(commentController.deleteComment);

module.exports = router;
