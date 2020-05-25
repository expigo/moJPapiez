const Monument = require('./monument.model')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/AppError')
const QueryBuilder = require('../../utils/queryBuilder')

exports.getMonument = catchAsync(async (req, res, next) => {
  const {id} = req.params

  const monument = await Monument.findById(id)
    .populate({
      path: 'reviews',
      select: '-user -__v ',
    })
    .exec()

  res.status(200).json({
    status: 'success',
    data: {
      monument,
    },
  })
})

exports.getAllMonuments = catchAsync(async (req, res, next) => {
  const query = new QueryBuilder(Monument.find(), req.query)
    .sanitize()
    .sort()
    .limitFields()
    .paginate()
    .build()

  const monuments = await query.exec()

  res.status(200).json({
    status: 'success',
    data: {
      monuments,
    },
  })
})

exports.createMonument = catchAsync(async (req, res, next) => {
  const monument = await Monument.create({...req.body})
  res.status(201).json({
    status: 'success',
    data: {
      monument,
    },
  })
})
exports.updateMonument = catchAsync(async (req, res, next) => {
  const monument = await Monument.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).exec()

  if (!monument) {
    return next(
      new AppError(`no monument found with id: ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    status: 'success',
    data: {
      monument,
    },
  })
})
exports.deleteMonument = catchAsync(async (req, res, next) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(
      new AppError(`no monument found with id: ${req.params.id}`, 404)
    )
  }
  const monument = await Monument.findByIdAndDelete(req.params.id).exec()

  if (!monument) {
    return next(
      new AppError(`no monument found with id: ${req.params.id}`, 404)
    )
  }
  res.status(204).json({
    // well with 204 the body won't be sent anyway...
    status: 'success',
    data: null,
  })
})

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
