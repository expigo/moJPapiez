const {connect} = require('./src/utils/db')
const mongoose = require('mongoose')
const Monument = require('./src/resources/monument/monument.model')
const User = require('./src/resources/user/user.model')

/*eslint-disable*/

const url =
  process.env.MONGODB_URI ||
  process.env.DB_URL ||
  `mongodb://localhost:27017/moJPapiez-test`

const preload = async () => {
  for (let i = 0; i < 3; i++) {
    await Monument.create({
      name: `Monument${i}`,
      category:
        Math.random() < 1 / 3
          ? 'statue'
          : Math.random() < 2 / 3
          ? 'graffiti'
          : 'painting',
    })

    await User.create({
      name: `name${i}`,
      email: `halo${i}@hi.com`,
    })
  }

  mongoose.connection.close()
}

connect(url)
  .then(preload)
  .catch(e => {
    console.log(e)
    mongoose.connection.close()
  })

process.on('unhandledRejection', err => {
  console.log('UNHANDLED EXCEPTION! Shutting down!!1!ONEONE')
  console.log(err.name, err.message)
  process.exit(1)
})
