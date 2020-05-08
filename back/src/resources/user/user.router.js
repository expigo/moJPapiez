const {Router} = require('express')
const controller = require('./user.controller')
const authController = require('../../utils/auth')

const router = Router()

router.post('/signup', authController.signup)
router.post('/signin', authController.signin)

router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

router.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
)

router.route('/').get(controller.getAllUsers)

module.exports = router
