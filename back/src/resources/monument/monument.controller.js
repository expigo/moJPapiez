const Monument = require('./monument.model')
const catchAsync = require('../../utils/catchAsync')
const AppError = require('../../utils/AppError')

exports.getMonument = catchAsync(async (req, res, next) => {
  const {id, type} = req.params

  const monument = await Monument.find({_id: id, category: type}).exec()

  res.status(200).json({
    status: 'success',
    data: {
      monument,
    },
  })
})

exports.getAllMonuments = catchAsync(async (req, res, next) => {
  const all = await Monument.find().exec()
  res.status(200).json({
    status: 'success',
    data: {
      all,
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
