const mongoose = require('mongoose')

const statueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A statue must have a name'],
    unique: true,
    trim: true,
    minlength: [5, 'A statue name must have at least 5 characters.'],
    maxlength: [5, 'A statue name must have at most 50 characters.'],
  },
  slug: String,
  category: {
    type: String,
    enum: {
      values: ['statue', 'painting', 'graffiti', 'other'],
      message:
        "'{VALUE}' not allowed! Can be either: statue, painting, graffiti, other.",
    },
  },
  imageCover: {
    type: String,
    required: [true, 'A statue must have an image'],
  },
  images: [String],
  description: {
    type: String,
    trim: true,
  },
  // difficulty: {
  //   type: Number,
  //   required: [
  //     true,
  //     'Please specify a difficulty of finding the statue (1-10)',
  //   ],
  //   min: 0,
  //   max: 10,
  //   default: 5,
  //   validate: {
  //     validator: Number.isInteger,
  //     message: '{VALUE} is not an integer value',
  //   },
  // },
  // ratingsAverge: {
  //   type: Number,
  //   default:
  // },
})

statueSchema.virtual('difficulty').get(function () {})
statueSchema.virtual('ratingsAverage').get(function () {})

const Statue = mongoose.model('statue', statueSchema)

module.exports = Statue
