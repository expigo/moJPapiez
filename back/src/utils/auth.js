const jwt = require('jsonwebtoken')

const User = require('../resources/user/user.model')
const catchAsync = require('./catchAsync')
const config = require('../config')
const AppError = require('./AppError')

exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(new AppError('Please provide email and password', 400))
  }

  if (!req.body.passwordConfirm) {
    return next(new AppError('Please confirm an email', 400))
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  })

  createAndSendToken(newUser, 201, res)
})

exports.signin = catchAsync(async (req, res, next) => {
  const {email, password} = req.body
  if (!email || !password) {
    return next(new AppError('Please provide email and password'), 400)
  }

  const user = await User.findOne({email}).select('+password').exec()

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Invalid email and password combination', 401))
  }

  createAndSendToken(user, 200, res)
})

exports.protect = catchAsync(async (req, res, next) => {
  const bearer = req.headers.authorization
  if (bearer && bearer.startsWith('Bearer ')) {
    var token = bearer.split(' ')[1].trim()
  }

  if (!token) return next(new AppError('You are not logged in!', 401))

  const payload = await verifyToken(token)

  const user = await User.findById(payload.id).exec()

  if (!user) {
    return next(
      new AppError('User associated with this token does no longer exist', 401)
    )
  }

  req.user = user

  next()
})

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(
      new AppError('You do not have permissions to perform this action', 403)
    )

  next()
}

// *****************

function createAndSendToken(user, statusCode, res) {
  const token = signToken(user._id)

  res.status(statusCode).json({
    status: 'success',
    token,
  })
}

function signToken(id) {
  return jwt.sign({id}, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  })
}

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })
}
