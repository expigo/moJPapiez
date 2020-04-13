const express = require('express')
const morgan = require('morgan')
const config = require('./config/index')

const monumentRouter = require('./resources/monument/monument.router')

const app = express()

app.disable('x-powered-by')

if (config.env == 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/v1/monuments', monumentRouter)

module.exports = app
