const dotenv = require('dotenv')
dotenv.config({
  path: '../../../.env',
})

const env = process.env.NODE_ENV || 'production'
const port = process.env.port || 2137

const baseConfig = {
  env,
  port,
}

let envConfig = {}

switch (env) {
  case 'dev':
  case 'development':
    envConfig = require('./dev')
    break
  case 'test':
  case 'testing':
    envConfig = require('./testing')
    break
  case 'prod':
  case 'production':
    envConfig = require('./prod')
    break
  default:
    envConfig = require('./dev')
}

module.exports = {...baseConfig, ...envConfig}
