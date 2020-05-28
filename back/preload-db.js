const {connect} = require('./src/utils/db')
const mongoose = require('mongoose')
const Monument = require('./src/resources/monument/monument.model')
const User = require('./src/resources/user/user.model')
const Review = require('./src/resources/review/review.model')
const getMonuments = require('./dev-data/monuments-placeholders').getMonuments
const getUsers = require('./dev-data/users-placeholders').getUser
const getReviews = require('./dev-data/reviews-placeholders')

/*eslint-disable*/

const url =
  process.env.MONGODB_URI ||
  process.env.DB_URL ||
  `mongodb://localhost:27017/moJPapiez`

const preload = async () => {
  await mongoose.connection.dropDatabase()
  for (let i = 0; i < 8; i++) {
    const monId = await Monument.create({
      name: `Monument${i}`,
      category:
        Math.random() < 1 / 3
          ? 'statue'
          : Math.random() < 2 / 3
          ? 'graffiti'
          : 'painting',
      ratingsAverage: getRandomInt(1, 10),
      ratingsQuantity: getRandomInt(1, 100),
    })

    const uId = await User.create({
      name: `name${i}`,
      email: `halo${i}@hi.com`,
      password: `p4ssw0rd${i}`,
      passwordConfirm: `p4ssw0rd${i}`,
    })

    for (let j = 0; j < getRandomInt(1, 5); j++) {
      await Review.create({
        review: `Review [${i}, ${j}]`,
        rating: getRandomInt(1, 10),
        monument: monId,
        user: uId,
      })
    }
  }

  mongoose.connection.close()
}

const preloadv2 = async () => {
  await mongoose.connection.dropDatabase()

  const [reviews, ratings] = getReviews()
  const ratMap = calcRatingsStats(ratings)
  await Monument.create(getMonuments(ratMap))
  await User.create(getUsers())
  await Review.create(reviews)

  mongoose.connection.close()
}

connect(url)
  .then(preloadv2)
  .catch(e => {
    console.log(e)
    mongoose.connection.close()
  })

process.on('unhandledRejection', err => {
  console.log(err.name, err.message)
  process.exit(1)
})

// ******

function calcRatingsStats(ratings) {
  var ratMap = new Map()
  ratings.forEach((v, k, m) => {
    ratMap.set(k.mid, {
      sum: v + ((ratMap.get(k.mid) && ratMap.get(k.mid).sum) || 0),
      n: (ratMap.get(k.mid) && ratMap.get(k.mid).n + 1) || 1,
    })
  })

  return ratMap
}
