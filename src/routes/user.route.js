const express = require('express')

const router = express.Router()
//? controllers
const userController = require('./../controllers/user.controller')
//? middlewares
const userMiddleware = require('../middlewares/user.middleware')
const validationMiddleware = require('../middlewares/validations.middleware')
const authMiddleware = require('../middlewares/auth.middleware')

router.use(authMiddleware.protect)

router.get('/', userController.getAllUsers)

router.use(authMiddleware.restrictTo('admin'))

router
  .use('/:id',userMiddleware.validUser)
  .route('/:id')
  .get(userController.getOneUser)
  .patch(validationMiddleware.updateUserValidation, userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router