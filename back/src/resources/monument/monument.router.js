const {Router} = require('express')
const controller = require('./monument.controller')
const auth = require('../../utils/auth')
const reviewRouter = require('../review/review.router')

const router = Router()

router.use('/:monumentId/reviews', reviewRouter)

router
  .route('/top')
  .get(controller.topXMonuments(1), controller.getAllMonuments)

router.get('/stats', controller.getMonumentsStats)

router
  .route('/within/:distance/center/:latlong')
  .get(controller.getMonumentsWithin)
router.route('/distances/:latlong').get(controller.getDistances)

router
  .route('/:id')
  .get(controller.getMonument)
  .patch(controller.updateMonument)
  .delete(auth.protect, auth.restrictTo('admin'), controller.deleteMonument)

router
  .route('/')
  .get(controller.getAllMonuments)
  .post(auth.protect, controller.createMonument)

router.route('/type/:type').get(controller.getAllByType)

module.exports = router
