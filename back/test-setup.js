const mongoose = require('mongoose')
const cuid = require('cuid')
const map = require('lodash.map')
// load model since the express server won't get instantiated for testing
require('./src/resources/statue/statue.model')
require('./src/resources/user/user.model')
const {connect} = require('./src/utils/db')

const url =
  process.env.MONGODB_URI ||
  process.env.DB_URL ||
  `mongodb://localhost:27017/moJPapiez`

const remove = collection =>
  new Promise((resolve, reject) => {
    collection.deleteOne(err => {
      if (err) return reject(err)
      resolve()
    })
  })

beforeEach(async done => {
  const db = cuid()
  function clearDB() {
    return Promise.all(map(mongoose.connection.collections, c => remove(c)))
  }

  if (mongoose.connection.readyState === 0) {
    try {
      await connect(url + db)

      await clearDB()
    } catch (e) {
      console.log('connection error')
      console.error(e)
      throw e
    }
  } else {
    await clearDB()
  }
  done()
})
afterEach(async done => {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
  return done()
})
afterAll(done => {
  return done()
})
