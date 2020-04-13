const {Router} = require('express')
const controller = require('./monument.controller')

const router = Router()

router
  .route('/')
  .get(controller.getAllMonuments)
  .post(controller.createMonument)

router.route('/:type').get(controller.getAllByType)

router
  .route('/:type?/:id')
  .get(controller.getMonument)
  .patch(controller.updateMonument)
  .delete(controller.deleteMonument)

module.exports = router
