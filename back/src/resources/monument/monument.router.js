const {Router} = require('express')
const controller = require('./monument.controller')
const statueController = require('./subrouters/statue.router')
const paintingController = require('./subrouters/statue.router')
const graffitiController = require('./subrouters/statue.router')

const router = Router()

router.use('/monument', statueController)
router.use('/painting', statueController)
router.use('/graffiti', statueController)

router.route('/').get(controller.getAllStatues).post(controller.createStatue)

router
  .route('/:id')
  .get(controller.getStatue)
  .patch(controller.updateStatue)
  .delete(controller.deleteStatue)

module.exports = router
