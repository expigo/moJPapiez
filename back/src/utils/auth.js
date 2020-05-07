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

  const user = await User.findOne({email}).select('+password')

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('Invalid email and password combination', 401))
  }

  createAndSendToken(user, 200, res)
})

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
