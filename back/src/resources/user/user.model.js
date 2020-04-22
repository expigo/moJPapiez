const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please supply a name',
  },
  email: {
    type: String,
    required: 'Please supply an email address',
    uniue: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address!'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
})

const User = mongoose.model('user', userSchema)

module.exports = User
