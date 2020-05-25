const Review = require('./review.model')
const catchAsync = require('../../utils/catchAsync')

exports.getAll = catchAsync(async (req, res, next) => {
  const filter = req.params.monumentId ? {monument: req.params.monumentId} : {}
  console.log(filter)
  const reviews = await Review.find(filter)

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  })
})

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.monument) req.body.monument = req.params.monumentId
  if (!req.body.user) req.body.user = req.user.id

  const newReview = await Review.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  })
})
