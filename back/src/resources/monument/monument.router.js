const {Router} = require('express')
const controller = require('./monument.controller')
const auth = require('../../utils/auth')

const router = Router()

router
  .route('/top')
  .get(controller.topXMonuments(1), controller.getAllMonuments)

router
  .route('/')
  .get(controller.getAllMonuments)
  .post(auth.protect, controller.createMonument)

router.route('/:type').get(controller.getAllByType)

router
  .route('/:id')
  .get(controller.getMonument)
  .patch(controller.updateMonument)
  .delete(auth.protect, auth.restrictTo('admin'), controller.deleteMonument)

module.exports = router
