const mongoose = require('mongoose')
const config = require('../config')

exports.connect = (url = config.dbUrl, additionalOptions = {}) => {
  return mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      ...additionalOptions,
    })
    .then(() => {
      console.log('connected!')
    })
    .catch(err => console.error(err))
}
