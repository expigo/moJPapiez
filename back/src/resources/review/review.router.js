const express = require('express')
const reviewController = require('./review.controller')
const auth = require('../../utils/auth')

const router = express.Router({mergeParams: true})

router.use(auth.protect)

router
  .route('/')
  .get(reviewController.getAll)
  .post(
    reviewController.populateMonumentAndUserIds,
    reviewController.createReview
  )

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(auth.restrictTo('admin'), reviewController.updateReview)
  .delete(auth.restrictTo('admin'), reviewController.deleteReview)

module.exports = router
