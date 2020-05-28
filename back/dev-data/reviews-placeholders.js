const userIds = require('./users-placeholders').getIds()
const monIds = require('./monuments-placeholders').ids

function getReviews() {
  var reviews = []
  const pairs = new Map()
  for (let i = 0; i < 50; i++) {
    let [uid, mid, rating] = getIdsAndRating(pairs)
    reviews.push({
      review: `Noice-${i}`,
      rating,
      monument: monIds[mid],
      user: userIds[uid],
    })
  }

  return [reviews, pairs]
}

module.exports = getReviews
// ************
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function getIdsAndRating(pairs) {
  let uid = getRandomInt(0, userIds.length)
  let mid = getRandomInt(0, monIds.length)
  const rating = getRandomInt(1, 10)

  if (pairs.has({uid, mid})) {
    getIdsAndRating(pairs)
  } else {
    pairs.set({uid, mid}, rating)
    return [uid, mid, rating]
  }
}
