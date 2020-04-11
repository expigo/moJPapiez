const {Router} = require('express')
const controller = require('../monument.controller')

const router = Router()

router.route('/').get(controller.getAllStatues).post(controller.createStatue)

router
  .route('/:id')
  .get(controller.getStatue)
  .patch(controller.updateStatue)
  .delete(controller.deleteStatue)

module.exports = router
