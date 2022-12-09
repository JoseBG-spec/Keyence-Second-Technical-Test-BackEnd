const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema(
  {
    "User ID": {
      type: String,
    },
    "User Name": {
      type: String,
    },
    Date: {
      type: String,
    },
    "Punch In": {
        type: String,
    },
    "Punch Out": {
        type: String,
    },
  },
  {
    collection: 'Users',
  },
)

module.exports = mongoose.model('User', userSchema)
