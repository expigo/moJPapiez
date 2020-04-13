const Monument = require('./monument.model')
const catchAsync = require('../../utils/catchAsync')

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
    throw new Error('no monument found')
  }

  res.status(200).json({
    status: 'success',
    data: {
      monument,
    },
  })
})
exports.deleteMonument = catchAsync(async (req, res, next) => {
  const monument = await Monument.findByIdAndDelete(req.params.id).exec()

  if (!monument) {
    throw new Error('no monument found')
  }
  res.status(204).json({
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
