require('dotenv').config({
  path: `${__dirname}/.env.test`,
})

const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitze = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const config = require('./config/index')
const AppError = require('./utils/AppError')
const monumentRouter = require('./resources/monument/monument.router')
const userRouter = require('./resources/user/user.router')
const errorFrontController = require('./utils/errorFrontController')

const app = express()

app.use(helmet())

app.disable('x-powered-by')

if (config.env == 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'The threshold of max request from this IP has been reached. Please try again later',
})

app.use(express.json({limit: '10kb'}))

app.use(mongoSanitze())

app.use(xss())

app.use(
  hpp({
    whitelist: ['ratingsAverage', 'ratingsQuantity', 'category'],
  })
)

app.use('/api', limiter)
app.use('/api/v1/monuments', monumentRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Woah, missing something (route handler maybe)? 🤷‍♀️ [${req.originalUrl}]`
    )
  )
})

app.use(errorFrontController)
module.exports = app
