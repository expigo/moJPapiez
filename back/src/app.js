const express = require('express')
const morgan = require('morgan')
const config = require('./config/index')

const statueRouter = require('./resources/statue/statue.router')

const app = express()

app.disable('x-powered-by')

if (config.env == 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/statue', statueRouter)

module.exports = app
