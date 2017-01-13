// imports
const mongoose = require('mongoose')

// define poll
var PollModel = mongoose.Schema({
  pollid: {
    type: String
  },
  name: {
    type: String
  },
  options: {
    type: String
  }
})

// set Poll equal to a reference of the PollModel mongoose schema
var Poll = module.exports = mongoose.model('Poll', PollModel)

// define Poll methods

// Poll method to insert a Poll into the database
module.exports.createPoll = function(newPoll, cb) {
  newPoll.save(cb)
}

// Poll method to get a Poll from the DB with provided pollID
module.exports.getPollByPollID = function(pollID, cb) {
  let query = {pollid: pollID}
  Poll.findOne(query, cb)
}
