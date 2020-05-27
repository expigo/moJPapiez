const mongoose = require('mongoose')
const Monument = require('../monument/monument.model')

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    monument: {
      type: mongoose.Schema.ObjectId,
      ref: 'monument',
      required: [true, 'Review must belong to a monument.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, 'Review must belong to a user!'],
    },
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
)

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'monument',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name email',
  })

  next()
})

reviewSchema.statics.calcAvgRatings = async function (monument) {
  const result = await this.aggregate([
    {
      $match: {monument},
    },
    {
      $group: {
        _id: '$monument',
        nRating: {$sum: 1},
        avgRating: {$avg: '$rating'},
      },
    },
  ])

  if (result.length > 0) {
    await Monument.findByIdAndUpdate(monument, {
      ratingsQuantity: result[0].nRating,
      ratingsAverage: result[0].avgRating,
    })
  } else {
    await Monument.findByIdAndUpdate(monument, {
      ratingsQuantity: 0,
      ratingsAverage: 5,
    })
  }
}

reviewSchema.post('save', function () {
  this.constructor.calcAvgRatings(this.monument)
})

reviewSchema.post(/^findOneAnd/, async function () {
  const r = await this.findOne()
  await this.r.constructor.calcAvgRatings(r)
})

const Review = mongoose.model('review', reviewSchema)

module.exports = Review
