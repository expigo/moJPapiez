const express = require('express')
const reviewController = require('./review.controller')
const auth = require('../../utils/auth')

const router = express.Router({mergeParams: true})

router
  .route('/')
  .get(reviewController.getAll)
  .post(auth.protect, reviewController.createReview)

module.exports = router
