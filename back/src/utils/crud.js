const catchAsync = require('./catchAsync')
const AppError = require('./AppError')
const QueryBuilder = require('./queryBuilder')

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    const {id} = req.params

    let query = Model.findById(id)
    if (populateOptions) query = query.populate(populateOptions)

    const doc = await query.exec()

    if (!doc) {
      return new AppError(`No document found with id: ${id}`, 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.getMany = Model =>
  catchAsync(async (req, res, next) => {
    // in case of review, getMany callback is a handler for both
    // get all reviews and get all reviews for specific monument
    // so we need to prepare the filter
    // TODO: there must a better way... 🤔
    const filter = req.params.monumentId
      ? {monument: req.params.monumentId}
      : {}

    const query = new QueryBuilder(Model.find(filter), req.query)
      .sanitize()
      .sort()
      .limitFields()
      .paginate()
      .build()

    const docs = await query.exec()

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    })
  })

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    })
  })

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return next(
        new AppError(`No document found with ID: ${req.params.id}`, 404)
      )
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return next(
        new AppError(`no document found with id: ${req.params.id}`, 404)
      )
    }
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) {
      return next(new AppError(`No doc found with ID: ${req.params.id}`, 404))
    }

    res.status(204).json({
      status: 'success',
      data: null,
    })
  })
