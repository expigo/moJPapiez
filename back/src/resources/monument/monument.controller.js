const Monument = require('./monument.model')
const catchAsync = require('../../utils/catchAsync')
const crud = require('../../utils/crud')

exports.createMonument = crud.createOne(Monument)
exports.getMonument = crud.getOne(Monument, {
  path: 'reviews',
  select: 'rating review user -monument',
})
exports.getAllMonuments = crud.getMany(Monument)
exports.updateMonument = crud.updateOne(Monument)
exports.deleteMonument = crud.deleteOne(Monument)

exports.getAllByType = catchAsync(async (req, res, next) => {
  const monuments = await Monument.find({
    category: req.params.type.toLowerCase(),
  })

  res.status(200).json({
    status: 'success',
    data: {
      monuments,
    },
  })
})

exports.limitTo = x => (req, res, next) => {
  req.query.limit = x

  next()
}

exports.topXMonuments = x => (req, res, next) => {
  req.query.limit = x
  req.query.sort = '-ratingsAverage'
  req.query.fields = 'name, ratingsAverage, category, ratingsQuantity'

  next()
}

exports.getMonumentsStats = catchAsync(async (req, res, next) => {
  const stats = await Monument.aggregate([
    {
      $match: {ratingsAverage: {$gte: 3}},
    },
    {
      $group: {
        _id: {$toUpper: '$category'},
        quantity: {$sum: 1},
        visitorsTotal: {$sum: '$ratingsQuantity'},
        avgRating: {$avg: '$ratingsAverage'},
        max: {$max: '$ratingsAverage'},
      },
    },
    {
      $lookup: {
        from: 'monuments',
        localField: 'max',
        foreignField: 'ratingsAverage',
        as: 'Best',
      },
    },
    {
      $sort: {visitorsTotal: 1},
    },
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  })
})
