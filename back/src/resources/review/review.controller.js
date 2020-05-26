const Review = require('./review.model')
const catchAsync = require('../../utils/catchAsync')
const crud = require('../../utils/crud')

exports.createReview = crud.createOne(Review)
exports.getAll = crud.getMany(Review)
exports.getReview = crud.getOne(Review)
exports.deleteReview = crud.deleteOne(Review)
exports.updateReview = crud.updateOne(Review)

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

exports.populateMonumentAndUserIds = (req, _, next) => {
  if (!req.body.monument) req.body.monument = req.params.monumentId
  if (!req.body.user) req.body.user = req.user.id

  next()
}
