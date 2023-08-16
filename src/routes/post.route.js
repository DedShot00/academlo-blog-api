const express = require('express');

//* Controllers
const postController = require('../controllers/post.controller');

//* Middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const postMiddleware = require('../middlewares/post.middleware');

const router = express.Router();

//* routes
router
  .route('/')
  .get(postController.findAllPosts)
  .post(
    authMiddleware.protect,
    validationMiddleware.createPostValidation,
    postController.createPost
  );

router.use(authMiddleware.protect);

router.get('/me', postController.findUserPosts);

router
  .use('/:id', postMiddleware.validpost)
  .route('/:id')
  .get(postController.getById)
  .patch(
    validationMiddleware.createPostValidation,
    authMiddleware.protectPostOwner,
    postController.updatePost
  )
  .delete(postController.deletePost);

module.exports = router;
