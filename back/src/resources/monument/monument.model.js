const mongoose = require('mongoose')
const slugify = require('slugify')

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

monumentSchema.index({ratingsAverage: 1, ratingsQuantity: 1})

monumentSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'monument',
  localField: '_id',
})

monumentSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true})
  next()
})

const Monument = mongoose.model('monument', monumentSchema)

module.exports = Monument
