const Monument = require('./monument.model')

exports.getMonument = async (req, res, next) => {
  try {
    const {id, type} = req.params

    const monument = await Monument.find({_id: id, category: type}).exec()

    res.status(200).json({
      status: 'success',
      data: {
        monument,
      },
    })
  } catch (e) {
    console.error(e)
  }
}

exports.getAllMonuments = async (req, res, next) => {
  try {
    const all = await Monument.find().exec()
    res.status(200).json({
      status: 'success',
      data: {
        all,
      },
    })
  } catch (error) {
    console.log(error)
  }
}
exports.createMonument = async (req, res, next) => {
  try {
    const monument = await Monument.create({...req.body})
    res.status(201).json({
      status: 'success',
      data: {
        monument,
      },
    })
  } catch (error) {
    console.log(error)
  }
}
exports.updateMonument = async (req, res, next) => {
  console.log(req.params.type)
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
}
exports.deleteMonument = async (req, res, next) => {
  const monument = await Monument.findByIdAndDelete(req.params.id).exec()

  if (!monument) {
    throw new Error('no monument found')
  }
  res.status(204).json({
    status: 'success',
    data: null,
  })
}

exports.getAllByType = async (req, res, next) => {
  const monuments = await Monument.find({
    category: req.params.type.toLowerCase(),
  })

  res.status(200).json({
    status: 'success',
    data: {
      monuments,
    },
  })
}
