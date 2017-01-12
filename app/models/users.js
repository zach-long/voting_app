const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// define user
var UserModel = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  }
})

var User = module.exports = mongoose.model('User', UserModel)

module.exports.createUser = function(newUser, cb) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash
      newUser.save(cb)
    })
  })
}

module.exports.getUserByUsername = function(username, cb) {
  let query = {username: username}
  User.findOne(query, cb)
}

module.exports.getUserById = function(id, cb) {
  User.findById(id, cb)
}

module.exports.comparePassword = function(checkPassword, hash, cb) {
  bcrypt.compare(checkPassword, hash, (err, isMatch) => {
    if (err) throw err
    cb(null, isMatch)
  })
}
