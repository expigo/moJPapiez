const mongoose = require('mongoose')

const statueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A statue must have a name'],
      unique: true,
      trim: true,
      minlength: [5, 'A statue name must have at least 5 characters.'],
      maxlength: [50, 'A statue name must have at most 50 characters.'],
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
      // required: [true, 'A statue must have an image'],
    },
    images: [String],
    description: {
      type: String,
      trim: true,
    },
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  }
)

statueSchema.virtual('difficulty').get(function () {})
statueSchema.virtual('ratingsAverage').get(function () {})

const Statue = mongoose.model('statue', statueSchema)

module.exports = Statue
