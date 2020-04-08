const mongoose = require('mongoose')

const statueSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
})

const Statue = mongoose.model('statue', statueSchema)

module.exports = Statue
