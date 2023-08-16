const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.updateUserValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  validFields,
];

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Name field is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be in a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must have at least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('passwrod must contain at least one letter'),
  body('description').notEmpty().withMessage('Description is required'),
  validFields,
];

exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be in a correct format'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must have at least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('passwrod must contain at least one letter'),
  validFields,
];

exports.updatePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 8 })
    .withMessage('password must have at least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('passwrod must contain at least one letter'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('password must have at least 8 characters')
    .matches(/[a-zA-Z]/)
    .withMessage('passwrod must contain at least one letter'),
];

exports.createPostValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  validFields,
];

exports.createCommentValidation = [
  body('text').notEmpty().withMessage('Text field is required'),
  body('postId').notEmpty().withMessage('PostId field is required'),
  validFields,
];

exports.updateCommentValidation = [
  body('text').notEmpty().withMessage('Text field is required'),
  validFields,
];
