const env = process.env.NODE_ENV || 'development'
const port = process.env.port || 2137

const baseConfig = {
  env,
  port,
  secrets: {
    jwt: process.env.JWT_SECRET,
    jwtExp: process.env.JWT_EXPIRES_IN || '100d',
    jwtCookieExpIn: process.env.JWT_COOKIE_EXPIRES_IN || '100',
  },
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
