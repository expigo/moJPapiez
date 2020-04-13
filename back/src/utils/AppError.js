class AppError extends Error {
  constructor(msg, statusCode) {
    super(msg)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error'
    // operational == run-time erors == anticipatble (e.g. failed db connection)
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
