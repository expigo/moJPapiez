const Statue = require('./statue.model')

exports.getStatue = async (req, res, next) => {
  try {
    const user = await Statue.create({...req.body})

    res.status(201).json({
      status: 'fail',
      data: {
        user,
      },
    })
  } catch (e) {
    console.error(e)
  }
}
exports.getAllStatues = (req, res, next) => {
  res.status(501).json({
    status: 'fail',
    message: 'Functionality not implemented yet',
  })
}
exports.createStatue = (req, res, next) => {
  res.status(501).json({
    status: 'fail',
    message: 'Functionality not implemented yet',
  })
}
exports.updateStatue = (req, res, next) => {
  res.status(501).json({
    status: 'fail',
    message: 'Functionality not implemented yet',
  })
}
exports.deleteStatue = (req, res, next) => {
  res.status(501).json({
    status: 'fail',
    message: 'Functionality not implemented yet',
  })
}
