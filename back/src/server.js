const app = require('./app')
const config = require('./config/index')
const {connect} = require('./utils/db')

/* eslint-disable*/

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down!!1!ONEONE')
  console.log(err.name, err.message)
  process.exit(1)
})
const server = app.listen(config.port, async () => {
  await connect()
  console.log(`I await your orders on port ${config.port}, Captain`)
})

process.on('unhandledRejection', err => {
  console.log('UNHANDLED EXCEPTION! Shutting down!!1!ONEONE')
  console.log(err, err.name, err.message)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully')
  server.close(() => {
    console.log('💥 Process terminated!')
  })
})
