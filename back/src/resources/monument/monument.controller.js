const Monument = require('./monument.model')
const catchAsync = require('../../utils/catchAsync')
const crud = require('../../utils/crud')
const AppError = require('../../utils/AppError')

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

const EARTH_RADIUS = 6378.1
exports.getMonumentsWithin = catchAsync(async (req, res, next) => {
  const {distance, latlong} = req.params
  const [lat, long] = latlong.split(',')
  const radius = distance / EARTH_RADIUS
  console.log(lat, long, radius)

  if (!lat || !long) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format: lat,long'
      ),
      400
    )
  }

  const monuments = await Monument.find({
    location: {$geoWithin: {$centerSphere: [[long, lat], radius]}},
  })

  res.status(200).json({
    status: 'success',
    data: {
      data: monuments,
    },
  })
})

exports.getDistances = catchAsync(async (req, res, next) => {
  const [lat, long] = req.params.latlong.split(',')

  if (!lat || !long) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format: lat,long'
      ),
      400
    )
  }

  const distances = await Monument.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+long, +lat],
        },
        distanceField: 'distance',
        distanceMultiplier: 0.001,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ])

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  })
})
