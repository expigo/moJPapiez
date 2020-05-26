const {Router} = require('express')
const controller = require('./user.controller')
const authController = require('../../utils/auth')

const router = Router()

router.get('/me', authController.protect, controller.getUser)

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

router.use(authController.protect)

router.delete('/deleteMe', controller.deleteMe)
router.patch('/updateMe', controller.updateMe)

module.exports = router
