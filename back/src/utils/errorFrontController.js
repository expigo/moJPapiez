const AppError = require('./AppError')

const sendErrorDev = (err, res) => {
  console.log(err)
  const errorDetails = {
    status: err.statusCode,
    error: err,
    message: err.message,
    stackHighlighted: err.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    ),
  }

  res.format({
    'application/json': () => res.status(err.statusCode).json(errorDetails),
  })
}

const sendErrorProd = (err, res) => {
  // operational -> probably made by the user
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
  } else {
    // console.err('ERROR 🤦‍♂️', err) // TODO: better logging maybe?
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    })
  }
}

const handleCastErrorDB = err => {
  console.log('💖CASTERROR💖')
  const msg = `Invalid ${err.path}: ${err.value}`
  return new AppError(msg, 400)
}

const handleDuplicateFieldDB = err => {
  //   console.log(err.errmsg)
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]

  const msg = `Duplicate field: ${value}`

  return new AppError(msg, 400)
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(e => e.message)
  const msg = `Invalid input: [${errors.join(', ')}]`
  return new AppError(msg, 400)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || '💥👃💥'
  err.stack = err.stack || ''
  console.log('PROD', process.env.NODE_ENV)
  if (process.env.NODE_ENV.includes('prod')) {
    let error = {...err}
    if (error.name == 'CastError') error = handleCastErrorDB(error)
    if (error.code == 11000) error = handleDuplicateFieldDB(error) // monogdb error code (no equivalent in mongoose)
    if (error.name == 'ValidationError') error = handleValidationErrorDB(error)
    sendErrorProd(err, res)
  } else {
    sendErrorDev(err, res)
  }
}
