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

router.use(authController.protect)
router.get('/me', controller.getMe, controller.getUser)
router.delete('/deleteMe', controller.deleteMe)
router.patch('/updateMe', controller.updateMe)

router.use(authController.restrictTo('admin'))
router.route('/').get(controller.getAllUsers).delete(controller.createUser)
router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser)

module.exports = router
