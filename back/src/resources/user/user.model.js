const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    uniue: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email not valid'],
  },
})

const User = mongoose.model('user', userSchema)

module.exports = User
