const mongoose = require('mongoose')
const config = require('../config')

console.log(config.dbUrl)

exports.connect = (url = config.dbUrl, additionalOptions = {}) => {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      ...additionalOptions,
    })
    .then(conn => {
      console.log(
        'DB connection successful! user: ',
        conn.connection.user || 'local'
      )
    })
}
