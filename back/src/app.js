const express = require('express')
const morgan = require('morgan')
const config = require('./config/index')
const AppError = require('./utils/AppError')
const monumentRouter = require('./resources/monument/monument.router')
const errorFrontController = require('./utils/errorFrontController')

const app = express()

app.disable('x-powered-by')

if (config.env == 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/v1/monuments', monumentRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Woah, missing something? 🤷‍♀️ [${req.originalUrl}]`))
})

app.use(errorFrontController)
module.exports = app
