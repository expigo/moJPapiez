const mongoose = require('mongoose')

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
    select: 'name user',
  })

  next()
})

const Review = mongoose.model('review', reviewSchema)

module.exports = Review
