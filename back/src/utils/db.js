const mongoose = require('mongoose')
const config = require('../config')

/* eslint-disable*/

console.log(config.dbUrl)

exports.connect = (url = config.dbUrl, additionalOptions = {}) => {
  console.log(config.dbUrl)
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      ...additionalOptions,
    })
    .then(conn => {
      console.log(
        'DB connection successful! user: ',
        conn.connection.user || 'local'
      )
    })
}
