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
router.get('/me', controller.getMe, controller.getOne)
router.delete('/deleteMe', controller.deleteMe)
router.patch('/updateMe', controller.updateMe)

router.use(authController.restrictTo('admin'))
router.route('/').get(controller.getMany).delete(controller.createOne)
router
  .route('/:id')
  .get(controller.getOne)
  .patch(controller.updateOne)
  .delete(controller.deleteOne)

module.exports = router
