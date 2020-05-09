const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const User = require('../resources/user/user.model')
const catchAsync = require('./catchAsync')
const config = require('../config')
const AppError = require('./AppError')
const sendEmail = require('./email-sender')

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

  if (user.wasPasswordChangedAfterIssuingToken(payload.iat)) {
    return next(
      new AppError(
        'Password has been changed recently. Please log in again',
        401
      )
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})

  if (!user) {
    return next(new AppError('There is no user with that email address'))
  }

  const resetToken = user.createPasswordResetToken()
  await user.save({validateBeforeSave: false})

  await prepareAndSendEmail(user, resetToken, req, res, next)
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()},
  })

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm

  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  await user.save()

  createAndSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await (await User.findById(req.user.id)).isSelected('+password')

  if (!(await user.checkPassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError(
        `Invalid current password. Try again. (Or stop if you're a hacker)`,
        401
      )
    )
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm

  await user.save()

  createAndSendToken(user, 200, res)
})

// *****************

function createAndSendToken(user, statusCode, res) {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(
      Date.now() + config.secrets.jwtCookieExpIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV.startsWith('prod')) cookieOptions.secure = true

  user.password = undefined

  res.cookie('jwt', token, cookieOptions)
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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

async function prepareAndSendEmail(user, token, req, res, next) {
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${token}`

  const msg = `Forgot your password? Submit a new one and its confirmation alongside (PATCH request) to ${resetUrl}. Ignore if you don't know what is it all about 🤭`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 15 minutes)',
      msg,
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent via email',
    })
  } catch (error) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save({validateBeforeSave: false})

    return next(new AppError('There was a problem with sending an email', 500))
  }
}
