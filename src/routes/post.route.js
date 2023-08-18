const express = require('express');

//* Controllers
const postController = require('../controllers/post.controller');

//* Middlewares
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');
const postMiddleware = require('../middlewares/post.middleware');
const { upload } = require('../utils/multer');

const router = express.Router();

//* routes
router
  .route('/')
  .get(postController.findAllPosts)
  .post(
    upload.array('postImgs', 5),
    authMiddleware.protect,
    validationMiddleware.createPostValidation,
    postController.createPost
  );

router.use(authMiddleware.protect);

router.get('/me', postController.findUserPosts);

router
  .route('/:id')
  .get(postMiddleware.validFullPost, postController.getById)
  .patch(
    postMiddleware.validpost,
    validationMiddleware.createPostValidation,
    authMiddleware.protectPostOwner,
    postController.updatePost
  )
  .delete(postMiddleware.validpost, postController.deletePost);

module.exports = router;
