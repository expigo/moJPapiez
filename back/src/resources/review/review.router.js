const express = require('express')
const reviewController = require('./review.controller')
const auth = require('../../utils/auth')

const router = express.Router({mergeParams: true})

router.use(auth.protect)

router
  .route('/')
  .get(reviewController.getMany)
  .post(reviewController.populateMonumentAndUserIds, reviewController.createOne)

router
  .route('/:id')
  .get(reviewController.getOne)
  .patch(auth.restrictTo('admin'), reviewController.updateOne)
  .delete(auth.restrictTo('admin'), reviewController.deleteOne)

module.exports = router
