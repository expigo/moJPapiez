const mongoose = require('mongoose')

const monumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A monument must have a name'],
      unique: true,
      trim: true,
      minlength: [5, 'A monument name must have at least 5 characters.'],
      maxlength: [50, 'A monument name must have at most 50 characters.'],
    },
    slug: String,
    category: {
      type: String,
      enum: {
        values: ['statue', 'painting', 'graffiti', 'other'],
        message:
          "'{VALUE}' not allowed! Can be either: statue, painting, graffiti, other.",
      },
      required: [true, 'A monument must fit into some category!'],
    },
    imageCover: {
      type: String,
      // required: [true, 'A monument must have an image'],
    },
    images: [String],
    description: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be above or equal 1'],
      max: [10, 'Rating must be below or equal 10'],
    },
    ratingsQuantity: {
      type: Number,
      default: 1,
    },
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
)

// monumentSchema.virtual('difficulty').get(function () {})
// monumentSchema
//   .virtual('ratingsAverage')
//   .get(function () {})
//   .set(function (x) {
//     this.set({x})
//   })

const Monument = mongoose.model('monument', monumentSchema)

module.exports = Monument
