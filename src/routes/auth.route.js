const express = require('express');

const authController = require('./../controllers/auth.controller');

//? Middleware
const validationMiddleware = require('../middlewares/validations.middleware');
const userMiddleware = require('../middlewares/user.middleware');
const authMiddlware = require('../middlewares/auth.middleware');
const { upload } = require('../utils/multer');

const router = express.Router();

router.post(
  '/signup',
  upload.single('profileImgUrl'),
  validationMiddleware.createUserValidation,
  authController.signUp
);

router.post(
  '/signin',
  validationMiddleware.loginUserValidation,
  authController.signIn
);

router.use(authMiddlware.protect);

router.patch(
  '/password/:id',
  validationMiddleware.updatePasswordValidation,
  userMiddleware.validUser,
  authMiddlware.protectAccountOwner,
  authController.updatePassword
);

module.exports = router;
